# Django Data Models Design

## Overview

This document outlines the Django data models for the stock research platform and portfolio management tool. The backend uses a **multi-database architecture** with separate databases for shared data and user-specific data. The backend integrates with **Authentik** for authentication and provides REST APIs for the React frontend.

## Technology Stack

- **Framework**: Django 5.0+ with Django REST Framework
- **Database**: PostgreSQL (multi-database setup)
  - **Common DB**: Authentication and shared stock data
  - **User DB**: User-specific portfolios, watchlists, and analysis
- **Authentication**: Authentik (self-hosted SSO)
- **API**: REST with DRF, JSON responses
- **Stock Data**: External API integration (Alpha Vantage, Finnhub, or similar)

---

## Multi-Database Architecture

### Database Structure

```
┌─────────────────────────────────────────────────────────────┐
│                         COMMON DB                            │
│  (Shared across all users - read-heavy)                     │
├─────────────────────────────────────────────────────────────┤
│  • User (authentication, profile)                            │
│  • UserPreferences                                           │
│  • StockQuote (cached price data)                           │
│  • StockFundamentals (cached company data)                  │
│  • ReferenceData (sectors, exchanges, industries)           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                         USER DB                              │
│  (User-specific data - write-heavy)                         │
├─────────────────────────────────────────────────────────────┤
│  • Portfolio, Holding, Transaction                          │
│  • Watchlist, WatchlistItem                                 │
│  • StockAnalysis                                            │
│  • PriceAlert                                               │
│  • SavedScreener                                            │
└─────────────────────────────────────────────────────────────┘
```

### Benefits

1. **Performance**: Separate read-heavy (stock data) from write-heavy (user data)
2. **Scaling**: Can scale databases independently
3. **Isolation**: User data isolated from shared data
4. **Caching**: Common DB can be heavily cached/replicated
5. **Backup**: Different backup strategies for each DB
6. **Security**: Additional isolation layer for user financial data

### Django Database Configuration

```python
# settings.py

DATABASES = {
    'default': {
        # Common DB - Auth and shared stock data
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('COMMON_DB_NAME', 'stockplatform_common'),
        'USER': os.getenv('COMMON_DB_USER', 'postgres'),
        'PASSWORD': os.getenv('COMMON_DB_PASSWORD'),
        'HOST': os.getenv('COMMON_DB_HOST', 'localhost'),
        'PORT': os.getenv('COMMON_DB_PORT', '5432'),
        'CONN_MAX_AGE': 600,
        'OPTIONS': {
            'sslmode': 'require',
        },
    },
    'userdata': {
        # User DB - Portfolios, watchlists, analysis
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('USER_DB_NAME', 'stockplatform_userdata'),
        'USER': os.getenv('USER_DB_USER', 'postgres'),
        'PASSWORD': os.getenv('USER_DB_PASSWORD'),
        'HOST': os.getenv('USER_DB_HOST', 'localhost'),
        'PORT': os.getenv('USER_DB_PORT', '5432'),
        'CONN_MAX_AGE': 600,
        'OPTIONS': {
            'sslmode': 'require',
        },
    },
}

# Database routers
DATABASE_ROUTERS = ['core.routers.MultiDBRouter']
```

### Database Router

```python
# core/routers.py

class MultiDBRouter:
    """
    Route database operations based on model's app label

    Common DB: accounts, stocks
    User DB: portfolios, watchlists, analysis, screeners
    """

    # Apps that use the common database
    common_db_apps = {'accounts', 'stocks'}

    # Apps that use the userdata database
    user_db_apps = {'portfolios', 'watchlists', 'analysis', 'screeners'}

    def db_for_read(self, model, **hints):
        """Direct reads to appropriate database"""
        if model._meta.app_label in self.common_db_apps:
            return 'default'
        if model._meta.app_label in self.user_db_apps:
            return 'userdata'
        return None

    def db_for_write(self, model, **hints):
        """Direct writes to appropriate database"""
        if model._meta.app_label in self.common_db_apps:
            return 'default'
        if model._meta.app_label in self.user_db_apps:
            return 'userdata'
        return None

    def allow_relation(self, obj1, obj2, **hints):
        """
        Allow relations between models in the same database
        Special case: Allow User (common) to relate to user data models
        """
        if obj1._meta.app_label in self.common_db_apps and \
           obj2._meta.app_label in self.common_db_apps:
            return True

        if obj1._meta.app_label in self.user_db_apps and \
           obj2._meta.app_label in self.user_db_apps:
            return True

        # Allow User (common) to be referenced by user data models
        if (obj1._meta.app_label == 'accounts' and obj1._meta.model_name == 'user') or \
           (obj2._meta.app_label == 'accounts' and obj2._meta.model_name == 'user'):
            return True

        return False

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        """Ensure migrations run on correct database"""
        if app_label in self.common_db_apps:
            return db == 'default'
        if app_label in self.user_db_apps:
            return db == 'userdata'
        return None
```

### Migration Commands

```bash
# Migrate common database
python manage.py migrate --database=default

# Migrate userdata database
python manage.py migrate --database=userdata

# Migrate all databases
python manage.py migrate --database=default && python manage.py migrate --database=userdata
```

### Cross-Database Considerations

#### ⚠️ Important Limitations

1. **No Foreign Key Constraints Across Databases**
   - Django doesn't enforce ForeignKey constraints across databases
   - Use `on_delete=models.DO_NOTHING` for cross-DB relations
   - Implement data integrity in application layer

2. **No Transactions Across Databases**
   - Cannot use `transaction.atomic()` across multiple databases
   - Use specific database transactions: `transaction.atomic(using='userdata')`
   - Consider saga pattern or two-phase commit for critical operations

3. **No JOIN Queries Across Databases**
   - Cannot join tables from different databases in single query
   - Must fetch data separately and join in Python
   - Consider denormalization where appropriate

#### Best Practices

```python
# ✅ GOOD: Separate transactions
from django.db import transaction

@transaction.atomic(using='default')
def update_user_profile(user_id, data):
    user = User.objects.using('default').get(id=user_id)
    user.profile_data = data
    user.save()

@transaction.atomic(using='userdata')
def create_portfolio(user_id, portfolio_data):
    portfolio = Portfolio.objects.create(
        user_id=user_id,  # Store user_id, not User object
        **portfolio_data
    )
    return portfolio

# ❌ BAD: Cannot span databases
@transaction.atomic()  # This won't work across databases
def create_user_and_portfolio(user_data, portfolio_data):
    user = User.objects.create(**user_data)
    portfolio = Portfolio.objects.create(user=user, **portfolio_data)
```

#### Querying Across Databases

```python
# User model is in 'default' DB
# Portfolio model is in 'userdata' DB

# Method 1: Use .using() explicitly
user = User.objects.using('default').get(id=user_id)
portfolios = Portfolio.objects.using('userdata').filter(user_id=user.id)

# Method 2: Database router handles it automatically
user = User.objects.get(id=user_id)  # Router directs to 'default'
portfolios = Portfolio.objects.filter(user_id=user.id)  # Router directs to 'userdata'

# Joining in Python (not SQL)
portfolios_with_users = []
for portfolio in portfolios:
    user = User.objects.get(id=portfolio.user_id)
    portfolios_with_users.append({
        'portfolio': portfolio,
        'user': user
    })
```

### Django Apps Structure

```
backend/
├── apps/
│   ├── accounts/          # Common DB
│   │   ├── models.py      # User, UserPreferences
│   │   └── ...
│   ├── stocks/            # Common DB
│   │   ├── models.py      # StockQuote, StockFundamentals
│   │   └── ...
│   ├── portfolios/        # User DB
│   │   ├── models.py      # Portfolio, Holding, Transaction
│   │   └── ...
│   ├── watchlists/        # User DB
│   │   ├── models.py      # Watchlist, WatchlistItem
│   │   └── ...
│   ├── analysis/          # User DB
│   │   ├── models.py      # StockAnalysis, PriceAlert
│   │   └── ...
│   └── screeners/         # User DB
│       ├── models.py      # SavedScreener
│       └── ...
└── core/
    ├── routers.py         # MultiDBRouter
    └── ...
```

---

## 1. User & Authentication Models

**Database**: `default` (Common DB)
**App**: `accounts`

### User Integration with Authentik

```python
# accounts/models.py

from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid

class User(AbstractUser):
    """
    Custom User model that integrates with Authentik SSO

    Authentik handles authentication, but we extend the user model
    to store additional platform-specific data.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Authentik will provide username, email, first_name, last_name
    # via OIDC/OAuth2 integration

    # Platform-specific fields
    timezone = models.CharField(max_length=50, default='UTC')
    currency_preference = models.CharField(max_length=3, default='USD')
    theme_preference = models.CharField(
        max_length=10,
        choices=[('light', 'Light'), ('dark', 'Dark'), ('auto', 'Auto')],
        default='auto'
    )

    # Subscription/tier info (for future use)
    subscription_tier = models.CharField(
        max_length=20,
        choices=[('free', 'Free'), ('premium', 'Premium'), ('enterprise', 'Enterprise')],
        default='free'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'users'
        indexes = [
            models.Index(fields=['email']),
        ]

    def __str__(self):
        return self.username or self.email


class UserPreferences(models.Model):
    """
    Additional user preferences and settings

    Note: This model is in the common DB, but references Portfolio/Watchlist
    from the userdata DB. We store UUIDs instead of ForeignKeys.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='preferences')

    # Display preferences (store UUIDs, not ForeignKeys, due to cross-DB limitation)
    default_portfolio_id = models.UUIDField(null=True, blank=True)
    default_watchlist_id = models.UUIDField(null=True, blank=True)

    # Email notification settings
    email_on_price_alerts = models.BooleanField(default=True)
    email_on_news = models.BooleanField(default=False)
    email_digest_frequency = models.CharField(
        max_length=10,
        choices=[('never', 'Never'), ('daily', 'Daily'), ('weekly', 'Weekly')],
        default='never'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'user_preferences'

    @property
    def default_portfolio(self):
        """Fetch default portfolio from userdata DB"""
        if not self.default_portfolio_id:
            return None
        from portfolios.models import Portfolio
        try:
            return Portfolio.objects.using('userdata').get(id=self.default_portfolio_id)
        except Portfolio.DoesNotExist:
            return None

    @property
    def default_watchlist(self):
        """Fetch default watchlist from userdata DB"""
        if not self.default_watchlist_id:
            return None
        from watchlists.models import Watchlist
        try:
            return Watchlist.objects.using('userdata').get(id=self.default_watchlist_id)
        except Watchlist.DoesNotExist:
            return None
```

**Notes**:
- Authentik handles login, registration, password resets via OIDC/OAuth2
- Django receives user info from Authentik tokens
- Use `django-oauth-toolkit` or `social-auth-app-django` for integration

---

## 2. Portfolio Models

**Database**: `userdata` (User DB)
**App**: `portfolios`

### Portfolio, Holding, Transaction

```python
# portfolios/models.py

from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal
import uuid

class Portfolio(models.Model):
    """
    User's investment portfolio

    Cross-database note: User model is in 'default' DB, Portfolio is in 'userdata' DB.
    We store user_id as UUIDField instead of ForeignKey to avoid cross-DB constraints.
    Data integrity is maintained at application layer.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Store user_id directly instead of ForeignKey for cross-database compatibility
    user_id = models.UUIDField(db_index=True)

    # Alternative: If you want ForeignKey (but without DB-level constraint)
    # user = models.ForeignKey(
    #     'accounts.User',
    #     on_delete=models.DO_NOTHING,
    #     db_constraint=False,  # Disable DB-level foreign key constraint
    #     related_name='portfolios'
    # )

    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    # Portfolio settings
    currency = models.CharField(max_length=3, default='USD')
    is_active = models.BooleanField(default=True)

    # Cached aggregates (updated on transaction changes)
    total_value = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=Decimal('0.00'),
        help_text="Current market value of all holdings"
    )
    total_cost = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=Decimal('0.00'),
        help_text="Total cost basis of all holdings"
    )
    cash_balance = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=Decimal('0.00'),
        validators=[MinValueValidator(Decimal('0.00'))]
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'portfolios'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user_id', '-created_at']),
            models.Index(fields=['user_id', 'is_active']),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=['user_id', 'name'],
                name='unique_portfolio_name_per_user'
            )
        ]

    def __str__(self):
        return f"Portfolio {self.name} (User: {self.user_id})"

    @property
    def user(self):
        """
        Fetch user from common DB

        Note: This performs a cross-database query. Cache the result if needed.
        """
        from accounts.models import User
        return User.objects.using('default').get(id=self.user_id)

    @property
    def total_gain(self):
        """Calculate total gain/loss"""
        return self.total_value - self.total_cost

    @property
    def total_gain_percent(self):
        """Calculate total gain/loss percentage"""
        if self.total_cost == 0:
            return Decimal('0.00')
        return (self.total_gain / self.total_cost) * 100


class Holding(models.Model):
    """
    Individual stock holding within a portfolio
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE, related_name='holdings')

    symbol = models.CharField(max_length=10, db_index=True)

    # Position details
    shares = models.DecimalField(
        max_digits=15,
        decimal_places=4,
        validators=[MinValueValidator(Decimal('0.0001'))]
    )
    average_cost = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))]
    )

    # Cached values (updated periodically)
    current_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )
    last_price_update = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'holdings'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['portfolio', 'symbol']),
            models.Index(fields=['symbol']),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=['portfolio', 'symbol'],
                name='unique_symbol_per_portfolio'
            ),
            models.CheckConstraint(
                check=models.Q(shares__gt=0),
                name='positive_shares'
            )
        ]

    def __str__(self):
        return f"{self.portfolio.name} - {self.symbol} ({self.shares} shares)"

    @property
    def total_cost(self):
        """Total cost basis"""
        return self.shares * self.average_cost

    @property
    def current_value(self):
        """Current market value"""
        if self.current_price:
            return self.shares * self.current_price
        return self.total_cost

    @property
    def gain(self):
        """Unrealized gain/loss"""
        return self.current_value - self.total_cost

    @property
    def gain_percent(self):
        """Unrealized gain/loss percentage"""
        if self.total_cost == 0:
            return Decimal('0.00')
        return (self.gain / self.total_cost) * 100


class Transaction(models.Model):
    """
    Buy/Sell/Dividend transactions
    """
    TRANSACTION_TYPES = [
        ('buy', 'Buy'),
        ('sell', 'Sell'),
        ('dividend', 'Dividend'),
        ('split', 'Stock Split'),
        ('deposit', 'Cash Deposit'),
        ('withdrawal', 'Cash Withdrawal'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE, related_name='transactions')

    transaction_type = models.CharField(max_length=15, choices=TRANSACTION_TYPES)
    symbol = models.CharField(max_length=10, blank=True, db_index=True)

    # Transaction details
    shares = models.DecimalField(
        max_digits=15,
        decimal_places=4,
        null=True,
        blank=True,
        validators=[MinValueValidator(Decimal('0.0001'))]
    )
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(Decimal('0.01'))]
    )
    amount = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        help_text="Total transaction amount (shares * price + fees)"
    )
    fees = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00')
    )

    # Metadata
    transaction_date = models.DateTimeField(db_index=True)
    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'transactions'
        ordering = ['-transaction_date']
        indexes = [
            models.Index(fields=['portfolio', '-transaction_date']),
            models.Index(fields=['symbol', '-transaction_date']),
            models.Index(fields=['transaction_type', '-transaction_date']),
        ]

    def __str__(self):
        return f"{self.transaction_type.upper()} {self.symbol} - {self.transaction_date.date()}"
```

---

## 3. Watchlist Models

**Database**: `userdata` (User DB)
**App**: `watchlists`

```python
# watchlists/models.py

from django.db import models
import uuid

class Watchlist(models.Model):
    """
    User's stock watchlist

    Cross-database note: User model is in 'default' DB, Watchlist is in 'userdata' DB.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.UUIDField(db_index=True)

    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'watchlists'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user_id', '-created_at']),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=['user_id', 'name'],
                name='unique_watchlist_name_per_user'
            )
        ]

    def __str__(self):
        return f"Watchlist {self.name} (User: {self.user_id})"

    @property
    def user(self):
        """Fetch user from common DB"""
        from accounts.models import User
        return User.objects.using('default').get(id=self.user_id)


class WatchlistItem(models.Model):
    """
    Individual stock in a watchlist
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    watchlist = models.ForeignKey(Watchlist, on_delete=models.CASCADE, related_name='items')

    symbol = models.CharField(max_length=10, db_index=True)
    notes = models.TextField(blank=True)

    # Cached price data (updated periodically)
    current_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )
    price_change = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )
    price_change_percent = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        null=True,
        blank=True
    )
    last_price_update = models.DateTimeField(null=True, blank=True)

    added_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'watchlist_items'
        ordering = ['-added_at']
        indexes = [
            models.Index(fields=['watchlist', 'symbol']),
            models.Index(fields=['symbol']),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=['watchlist', 'symbol'],
                name='unique_symbol_per_watchlist'
            )
        ]

    def __str__(self):
        return f"{self.watchlist.name} - {self.symbol}"
```

---

## 4. Stock Analysis Models

**Database**: `userdata` (User DB)
**App**: `analysis`

```python
# analysis/models.py

from django.db import models
import uuid

class StockAnalysis(models.Model):
    """
    User's manual stock analysis notes

    Stores structured analysis for the Analysis workspace:
    - Investment Thesis
    - Bull Case
    - Bear Case
    - Valuation Analysis
    - Management & Governance
    - Risks
    - Conclusion

    Cross-database note: User model is in 'default' DB, StockAnalysis is in 'userdata' DB.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.UUIDField(db_index=True)

    symbol = models.CharField(max_length=10, db_index=True)

    # Analysis sections (JSON or individual text fields)
    thesis = models.TextField(blank=True, help_text="Investment Thesis")
    bull_case = models.TextField(blank=True, help_text="Bull Case")
    bear_case = models.TextField(blank=True, help_text="Bear Case")
    valuation = models.TextField(blank=True, help_text="Valuation Analysis")
    management = models.TextField(blank=True, help_text="Management & Governance")
    risks = models.TextField(blank=True, help_text="Key Risks & Concerns")
    conclusion = models.TextField(blank=True, help_text="Conclusion & Action")

    # Metadata
    last_saved = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'stock_analyses'
        ordering = ['-last_saved']
        indexes = [
            models.Index(fields=['user_id', 'symbol']),
            models.Index(fields=['user_id', '-last_saved']),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=['user_id', 'symbol'],
                name='unique_analysis_per_user_symbol'
            )
        ]
        verbose_name_plural = 'Stock analyses'

    def __str__(self):
        return f"Analysis for {self.symbol} (User: {self.user_id})"

    @property
    def user(self):
        """Fetch user from common DB"""
        from accounts.models import User
        return User.objects.using('default').get(id=self.user_id)


class PriceAlert(models.Model):
    """
    Price alerts for stocks
    """
    ALERT_TYPES = [
        ('above', 'Price Above'),
        ('below', 'Price Below'),
        ('change_percent', 'Price Change %'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.UUIDField(db_index=True)

    symbol = models.CharField(max_length=10, db_index=True)
    alert_type = models.CharField(max_length=20, choices=ALERT_TYPES)
    target_value = models.DecimalField(max_digits=10, decimal_places=2)

    is_active = models.BooleanField(default=True)
    triggered_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'price_alerts'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user_id', 'is_active']),
            models.Index(fields=['symbol', 'is_active']),
        ]

    def __str__(self):
        return f"Alert for {self.symbol} {self.alert_type} {self.target_value} (User: {self.user_id})"

    @property
    def user(self):
        """Fetch user from common DB"""
        from accounts.models import User
        return User.objects.using('default').get(id=self.user_id)
```

---

## 5. Stock Screener Models

**Database**: `userdata` (User DB)
**App**: `screeners`

```python
# screeners/models.py

from django.db import models
import uuid

class SavedScreener(models.Model):
    """
    Saved stock screener with filter criteria

    Cross-database note: User model is in 'default' DB, SavedScreener is in 'userdata' DB.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.UUIDField(db_index=True)

    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    # Store filter criteria as JSON
    # Example: {
    #   "marketCap": {"min": 1000000000, "max": null},
    #   "pe": {"min": null, "max": 25},
    #   "sector": ["Technology", "Healthcare"]
    # }
    criteria = models.JSONField(default=dict)

    # Results caching
    last_run = models.DateTimeField(null=True, blank=True)
    result_count = models.IntegerField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'saved_screeners'
        ordering = ['-updated_at']
        indexes = [
            models.Index(fields=['user_id', '-updated_at']),
        ]

    def __str__(self):
        return f"Screener {self.name} (User: {self.user_id})"

    @property
    def user(self):
        """Fetch user from common DB"""
        from accounts.models import User
        return User.objects.using('default').get(id=self.user_id)
```

---

## 6. Stock Data Cache Models (Optional)

**Database**: `default` (Common DB)
**App**: `stocks`

```python
# stocks/models.py

from django.db import models

class StockQuote(models.Model):
    """
    Cached stock quote data to reduce API calls
    """
    symbol = models.CharField(max_length=10, primary_key=True, db_index=True)

    # Price data
    price = models.DecimalField(max_digits=10, decimal_places=2)
    change = models.DecimalField(max_digits=10, decimal_places=2)
    change_percent = models.DecimalField(max_digits=6, decimal_places=2)

    open_price = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    high = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    low = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    previous_close = models.DecimalField(max_digits=10, decimal_places=2, null=True)

    volume = models.BigIntegerField(null=True)
    market_cap = models.BigIntegerField(null=True)

    last_updated = models.DateTimeField(auto_now=True, db_index=True)

    class Meta:
        db_table = 'stock_quotes'

    def __str__(self):
        return f"{self.symbol} - ${self.price}"


class StockFundamentals(models.Model):
    """
    Cached fundamental data
    """
    symbol = models.CharField(max_length=10, primary_key=True, db_index=True)

    company_name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    sector = models.CharField(max_length=100, blank=True)
    industry = models.CharField(max_length=100, blank=True)

    # Store detailed fundamentals as JSON
    data = models.JSONField(default=dict)

    last_updated = models.DateTimeField(auto_now=True, db_index=True)

    class Meta:
        db_table = 'stock_fundamentals'
        verbose_name_plural = 'Stock fundamentals'

    def __str__(self):
        return f"{self.symbol} - {self.company_name}"
```

---

## Model Relationships Diagram

```
User (Authentik)
├── Portfolio (1:N)
│   ├── Holding (1:N)
│   └── Transaction (1:N)
├── Watchlist (1:N)
│   └── WatchlistItem (1:N)
├── StockAnalysis (1:N)
├── PriceAlert (1:N)
└── SavedScreener (1:N)

StockQuote (shared cache)
StockFundamentals (shared cache)
```

---

## Key Design Decisions

### 1. **UUIDs as Primary Keys**
- Better for distributed systems and API security
- No sequential ID leakage
- Easier merging/syncing if needed

### 2. **Cached Aggregates**
- `Portfolio.total_value`, `Portfolio.total_cost` cached for performance
- Update via signals when transactions/holdings change
- Trade-off: slight data staleness for query speed

### 3. **Soft Deletes vs Hard Deletes**
- Consider adding `is_deleted` + `deleted_at` fields for audit trail
- Especially important for financial data

### 4. **Decimal Fields for Currency**
- NEVER use FloatField for money/prices
- DecimalField ensures precision

### 5. **Stock Data Caching**
- Separate models for quotes/fundamentals
- TTL-based refresh strategy
- Reduces API costs

### 6. **JSONField for Flexibility**
- Screener criteria stored as JSON for flexibility
- Stock fundamentals stored as JSON (schema varies by provider)
- PostgreSQL has excellent JSON query support

---

## Database Indexes Strategy

**High Priority Indexes:**
- `user_id` on all user-owned models
- `symbol` on all stock-related models
- `(user_id, created_at)` for timeline queries
- `(portfolio_id, symbol)` for holdings lookup
- `is_active` flags for filtering

**Composite Indexes:**
- User + timestamp for "recent activity" queries
- Portfolio + transaction_date for history
- Watchlist + symbol for quick lookups

---

## Next Steps

1. ✅ Review model design
2. ⬜ Create Django apps structure (`accounts`, `portfolios`, `watchlists`, `analysis`, `screeners`, `stocks`)
3. ⬜ Implement models with migrations
4. ⬜ Add model methods and properties
5. ⬜ Configure Authentik integration
6. ⬜ Create Django admin interfaces
7. ⬜ Build DRF serializers and viewsets
8. ⬜ Design REST API endpoints
9. ⬜ Add Celery tasks for price updates
10. ⬜ Implement stock API integration layer

---

## Questions for Consideration

1. **Stock data provider**: Which API? (Alpha Vantage, Finnhub, IEX Cloud, Polygon.io?)
2. **Real-time vs delayed**: Do we need WebSocket for real-time prices?
3. **Data retention**: How long to keep transaction history?
4. **Multi-currency**: Support multiple currencies or USD only?
5. **Tax reporting**: Should we calculate cost basis (FIFO/LIFO) for tax purposes?
6. **Audit logging**: Track all changes to portfolios/holdings?
7. **Rate limiting**: API rate limits per user tier?


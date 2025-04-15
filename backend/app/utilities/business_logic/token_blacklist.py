from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models import BlacklistedToken

class TokenBlacklist:
    def __init__(self, db: Session):
        self.db = db
    
    def blacklist_token(self, token: str, expiry: datetime):
        blacklisted_token = BlacklistedToken(token=token, expiry=expiry)
        self.db.add(blacklisted_token)
        self.db.commit()
    
    def is_blacklisted(self, token: str) -> bool:
        result = self.db.query(BlacklistedToken).filter_by(token=token).first()
        return result is not None
    
    def cleanup_expired_tokens(self):
        now = datetime.utcnow()
        self.db.query(BlacklistedToken).filter(BlacklistedToken.expiry < now).delete()
        self.db.commit()
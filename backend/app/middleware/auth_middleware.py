# from fastapi import Request, HTTPException, Depends
# from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
# from app.utilities.business_logic.jwt_service import JWTService
# from app.database import get_db
# from fastapi.security import OAuth2PasswordBearer

# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")


# class AuthMiddleware(HTTPBearer):
#     def __init__(self, jwt_service: JWTService):
#         super().__init__(auto_error=True)
#         self.jwt_service = jwt_service

#     async def __call__(self, request: Request):
#         credentials: HTTPAuthorizationCredentials = await super().__call__(request)
#         payload = self.jwt_service.verify_token(credentials.credentials)
#         request.state.user = payload
#         return payload


# class AuthMiddleware(HTTPBearer):
#     def __init__(self, jwt_service: JWTService):
#         super().__init__(auto_error=True)
#         self.jwt_service = jwt_service

#     async def __call__(self, request: Request):
#         credentials: HTTPAuthorizationCredentials = await super().__call__(request)
#         payload = self.jwt_service.verify_token(credentials.credentials)
#         request.state.user = payload
#         return payload
    

# Functionality:
# This middleware:

# 1. **Extracts JWT tokens**: It inherits from FastAPI's `HTTPBearer` class, which automatically extracts the Bearer token from the Authorization header.
# 2. **Verifies tokens**: It uses your `JWTService` to verify the token's validity, checking:

# 1. If the token is properly signed
# 2. If the token has expired
# 3. If the token has been blacklisted (if you implement this check)



# 3. **Makes user data available**: It stores the decoded token payload in `request.state.user`, making the user's information available to route handlers.
# 4. **Returns the payload**: The payload is returned, allowing it to be used as a dependency.

# Example usage:
# Create an instance of the middleware
# from app.utilities.business_logic.jwt_service import JWTService
# from app.utilities.middleware.auth_middleware import AuthMiddleware

# jwt_service = JWTService()
# auth_middleware = AuthMiddleware(jwt_service)

# # Use it as a dependency in your routes
# @router.get("/protected-route")
# async def protected_route(user_data: dict = Depends(auth_middleware)):
#     return {"message": f"Hello, {user_data['email']}!"}

# # Or access the user data from the request
# @router.get("/another-protected-route")
# async def another_protected_route(request: Request):
#     user = request.state.user
#     return {"message": f"Hello, {user['email']}!"}

#Role Based Control:
# def require_roles(roles: list[str]):
#     """Dependency to check if user has required roles"""
#     def role_checker(user_data: dict = Depends(auth_middleware)):
#         user_role = user_data.get("role")
#         if user_role not in roles:
#             raise HTTPException(
#                 status_code=403,
#                 detail=f"Access denied. Required roles: {', '.join(roles)}"
#             )
#         return user_data
#     return role_checker

# # Usage in routes
# @router.get("/admin-only")
# async def admin_only(user_data: dict = Depends(require_roles(["admin"]))):
#     return {"message": "Welcome, admin!"}
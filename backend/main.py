from fastapi import FastAPI, Request
from backend.database import engine
from backend.models import user,project,calculation,report
from backend.routers import users, projects,calculations
from backend.routers import reports
from backend.routers import notifications
import os
from fastapi.middleware.cors import CORSMiddleware


user.Base.metadata.create_all(bind=engine)
project.Base.metadata.create_all(bind=engine)
calculation.Base.metadata.create_all(bind=engine)
report.Base.metadata.create_all(bind=engine)
debug_mode = os.getenv("DEBUG", "false").lower() == "true"
app = FastAPI(debug=debug_mode)
frontend_origin = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    print(f"Request: {request.method} {request.url}")
    response = await call_next(request)
    print(f"Response status: {response.status_code}")
    return response
# Inclure Users
app.include_router(users.router, prefix="/api", tags=["Users"])

# Inclure Projects
app.include_router(projects.router, prefix="/api", tags=["Projects"])

# Inclure Calculations
app.include_router(calculations.router, prefix="/api", tags=["Calculations"])
# Inclure Reports
app.include_router(reports.router, prefix="/api", tags=["Reports"])
app.include_router(notifications.router, prefix="/api", tags=["Notifications"])
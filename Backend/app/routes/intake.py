from datetime import datetime
from typing import Optional
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.database import get_database

router = APIRouter()


class VehicleRequestCreate(BaseModel):
    email: Optional[EmailStr] = None
    make: str
    model: str
    generation: Optional[str] = None
    year_range: Optional[str] = None
    engine: Optional[str] = None
    use_case: Optional[str] = None
    why: Optional[str] = None
    source: Optional[str] = "web_mvp"


class BuildSubmissionCreate(BaseModel):
    email: Optional[EmailStr] = None
    car: str
    engine: Optional[str] = None
    transmission: Optional[str] = None
    current_power: Optional[str] = None
    goal_power: Optional[str] = None
    budget: Optional[str] = None
    use_case: Optional[str] = None
    current_mods: Optional[str] = None
    pain_point: Optional[str] = None
    contact_ok: bool = False
    source: Optional[str] = "web_mvp"


class LeadCreate(BaseModel):
    email: EmailStr
    interest_area: Optional[str] = None
    message: Optional[str] = None
    source: Optional[str] = "web_mvp"


@router.post("/vehicle-request")
def create_vehicle_request(payload: VehicleRequestCreate, db: Session = Depends(get_database)):
    request_id = f"vehicle_request_{uuid4().hex[:16]}"

    sql = text(
        """
        INSERT INTO mvp_vehicle_requests (
            request_id,
            email,
            make,
            model,
            generation,
            year_range,
            engine,
            use_case,
            why,
            source,
            created_at
        )
        VALUES (
            :request_id,
            :email,
            :make,
            :model,
            :generation,
            :year_range,
            :engine,
            :use_case,
            :why,
            :source,
            :created_at
        )
        RETURNING request_id, created_at
        """
    )

    try:
        result = db.execute(
            sql,
            {
                "request_id": request_id,
                "email": payload.email,
                "make": payload.make.strip(),
                "model": payload.model.strip(),
                "generation": payload.generation,
                "year_range": payload.year_range,
                "engine": payload.engine,
                "use_case": payload.use_case,
                "why": payload.why,
                "source": payload.source or "web_mvp",
                "created_at": datetime.utcnow(),
            },
        ).mappings().one()

        db.commit()

        return {
            "status": "ok",
            "type": "vehicle_request",
            "id": result["request_id"],
            "created_at": result["created_at"],
        }

    except Exception as exc:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to save vehicle request: {exc}")


@router.post("/build-submission")
def create_build_submission(payload: BuildSubmissionCreate, db: Session = Depends(get_database)):
    submission_id = f"build_submission_{uuid4().hex[:16]}"

    sql = text(
        """
        INSERT INTO mvp_build_submissions (
            submission_id,
            email,
            car,
            engine,
            transmission,
            current_power,
            goal_power,
            budget,
            use_case,
            current_mods,
            pain_point,
            contact_ok,
            source,
            created_at
        )
        VALUES (
            :submission_id,
            :email,
            :car,
            :engine,
            :transmission,
            :current_power,
            :goal_power,
            :budget,
            :use_case,
            :current_mods,
            :pain_point,
            :contact_ok,
            :source,
            :created_at
        )
        RETURNING submission_id, created_at
        """
    )

    try:
        result = db.execute(
            sql,
            {
                "submission_id": submission_id,
                "email": payload.email,
                "car": payload.car.strip(),
                "engine": payload.engine,
                "transmission": payload.transmission,
                "current_power": payload.current_power,
                "goal_power": payload.goal_power,
                "budget": payload.budget,
                "use_case": payload.use_case,
                "current_mods": payload.current_mods,
                "pain_point": payload.pain_point,
                "contact_ok": payload.contact_ok,
                "source": payload.source or "web_mvp",
                "created_at": datetime.utcnow(),
            },
        ).mappings().one()

        db.commit()

        return {
            "status": "ok",
            "type": "build_submission",
            "id": result["submission_id"],
            "created_at": result["created_at"],
        }

    except Exception as exc:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to save build submission: {exc}")


@router.post("/lead")
def create_lead(payload: LeadCreate, db: Session = Depends(get_database)):
    lead_id = f"lead_{uuid4().hex[:16]}"

    sql = text(
        """
        INSERT INTO mvp_leads (
            lead_id,
            email,
            interest_area,
            message,
            source,
            created_at
        )
        VALUES (
            :lead_id,
            :email,
            :interest_area,
            :message,
            :source,
            :created_at
        )
        RETURNING lead_id, created_at
        """
    )

    try:
        result = db.execute(
            sql,
            {
                "lead_id": lead_id,
                "email": payload.email,
                "interest_area": payload.interest_area,
                "message": payload.message,
                "source": payload.source or "web_mvp",
                "created_at": datetime.utcnow(),
            },
        ).mappings().one()

        db.commit()

        return {
            "status": "ok",
            "type": "lead",
            "id": result["lead_id"],
            "created_at": result["created_at"],
        }

    except Exception as exc:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to save lead: {exc}")
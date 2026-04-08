
from app.db.base import Base
from app.db.sessions import engine
from app.models.vehicle import Vehicle, VehicleSpec
from app.models.part import Part, PartFitment, PartDependency, PartExclusion

def init_db():
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully.")


if __name__ == "__main__":
    init_db()
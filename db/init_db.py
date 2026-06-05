
from base import Base
from sessions import engine
from models.vehicle import Vehicle, VehicleSpec
from models.part import Part, PartFitment, PartDependency, PartExclusion

def init_db():
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully.")


if __name__ == "__main__":
    init_db()
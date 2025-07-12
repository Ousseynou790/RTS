from sqlalchemy import (
    Column,
    Integer,
    String,
    DECIMAL,
    Boolean,
    Enum,
    ForeignKey,
    Text,
    TIMESTAMP,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from backend.database import Base

class ZoneTypeEnum(str, enum.Enum):
    urban_dense = "urban_dense"
    urban = "urban"
    suburban = "suburban"
    rural = "rural"

class Calculation(Base):
    __tablename__ = "calculations"

    id = Column(Integer, primary_key=True, autoincrement=True)
    uuid = Column(String(36), unique=True, server_default=func.uuid())
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    version = Column(Integer, default=1)
    is_current = Column(Boolean, default=True)

    # Paramètres de zone
    surface_area = Column(DECIMAL(10, 2), nullable=False)
    population = Column(Integer, nullable=False)
    zone_type = Column(Enum(ZoneTypeEnum), nullable=False)
    penetration_rate = Column(DECIMAL(5, 2), nullable=False)
    bhca_per_subscriber = Column(DECIMAL(4, 2), nullable=False)

    # Paramètres radio
    frequency = Column(Integer, nullable=False)
    tx_power = Column(DECIMAL(5, 2), nullable=False)
    antenna_gain = Column(DECIMAL(5, 2), nullable=False)
    sensitivity = Column(DECIMAL(6, 2), nullable=False)
    fade_margin = Column(DECIMAL(5, 2), default=10)
    interference_margin = Column(DECIMAL(5, 2), default=3)

    # Paramètres trafic
    subscribers = Column(Integer, nullable=False)
    call_duration = Column(DECIMAL(4, 2), nullable=False)

    # Résultats calculés
    cell_radius = Column(DECIMAL(6, 2))
    covered_area = Column(DECIMAL(10, 2))
    number_of_sites = Column(Integer)
    total_traffic = Column(DECIMAL(10, 2))
    trx_per_site = Column(Integer)
    total_channels = Column(Integer)
    spectral_efficiency = Column(DECIMAL(6, 4))
    site_efficiency = Column(DECIMAL(5, 2))
    coverage_reliability = Column(DECIMAL(5, 2))

    calculation_method = Column(String(100), default="standard_gsm")
    notes = Column(Text)

    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    # Relations (si tu veux)
    project = relationship("Project", back_populates="calculations")

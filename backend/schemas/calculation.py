from pydantic import BaseModel
from typing import Optional

class CalculationCreate(BaseModel):
    project_id: int
    name: str
    surface_area: float
    population: int
    zone_type: str
    penetration_rate: float
    bhca_per_subscriber: float
    frequency: int
    tx_power: float
    antenna_gain: float
    sensitivity: float
    fade_margin: Optional[float] = 10
    interference_margin: Optional[float] = 3
    subscribers: int
    call_duration: float
    
    cell_radius: float
    covered_area: float
    number_of_sites: int
    total_traffic: float
    trx_per_site: int
    total_channels: int
    spectral_efficiency: float
    site_efficiency: float
    coverage_reliability: float

class CalculationResponse(BaseModel):
    id: int
    uuid: str
    project_id: int
    user_id: int
    name: str
    version: int
    is_current: bool
    
    surface_area: float
    population: int
    zone_type: str
    penetration_rate: float
    bhca_per_subscriber: float
    
    frequency: int
    tx_power: float
    antenna_gain: float
    sensitivity: float
    fade_margin: float
    interference_margin: float
    
    subscribers: int
    call_duration: float
    
    cell_radius: float
    covered_area: float
    number_of_sites: int
    total_traffic: float
    trx_per_site: int
    total_channels: int
    spectral_efficiency: float
    site_efficiency: float
    coverage_reliability: float

    class Config:
        orm_mode = True
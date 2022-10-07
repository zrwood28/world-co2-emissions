-- Create Table
Create Table world_co2(
id Text Primary key,
country Text,
year int,
iso_code Text,
population bigint,
gdp bigint,
co2 float,
cement_co2 float,
coal_co2 float,
flaring_co2 float,
gas_co2 float,
oil_co2 float,
other_industry_co2 float,
co2_per_capita float,
cement_co2_per_capita float,
coal_co2_per_capita float,
flaring_co2_per_capita float,
gas_co2_per_capita float,
oil_co2_per_capita float,
other_co2_per_capita float,
share_global_co2 float, 
share_global_cumulative_co2 float);

select * from world_co2;
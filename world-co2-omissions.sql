-- Create Table
Create Table world_co2(
id Text Primary key,
country Text,
year int,
iso_code Text,
population bigint,
gdp bigint,
co2 decimal,
cement_co2 decimal,
coal_co2 decimal,
flaring_co2 decimal,
gas_co2 decimal,
oil_co2 decimal,
other_industry_co2 decimal,
co2_per_capita decimal,
cement_co2_per_capita decimal,
coal_co2_per_capita decimal,
flaring_co2_per_capita decimal,
gas_co2_per_capita decimal,
oil_co2_per_capita decimal,
other_co2_per_capita decimal,
share_global_co2 decimal, 
share_global_cumulative_co2 decimal);

select * from world_co2;
# User Guide

- ## Environment Settings
  - run ``npm install`` in terminal to install all dependent packages
  - run ``docker-compose up -d`` in the terminal to start the service of **nats-server** and **mongodb**
  - run ``node src`` in terminal to start up the whole services
  - run ``npm test`` in terminal to start the unit-testing of whole project

- ## Features
  - measureService
    - it is presented as **Pre-Layer Measurement Generator** in the architecture, which is the cron job to be triggered regularly for invoking the **APC** service
  - apcService
    - it is presented as **APC** service to calculate and return the **period** and **temperature** result by the type of stake
  - paramsService 
    - it is presented as **Control Parameter Generator** in the architecture, which is the cron job to be triggered regularly for publishing the **thickness factor** and **moisture factor** to the **APC** service. These two factor will be used as the parameters in specific **strategy** of **APC** service

- ## Config Settings
  - the config file is in the path of ``./config/default.js``
    - change the value of **config.nats.connection** when you want to connect to the external nats-server, the default number is the local nats-server of ``127.0.0.1:4222``
    - **measureService** is cron job which is triggered once with the period of **config.cron.measurePeriod**, the default number is ``10000ms``
    - **paramsService** is cron job which is triggered once with the period of **config.cron.paramsPeriod**, the default number is ``15000ms`` 

- ## Bonus
  - the **thickness factor** and **moisture factor** are stored in the memory cahce on ``global.cache`` of ``./src/index.js``. Is that possible to leverage MongoDB to store and retrieve this data?
  - there are two strategies (sharonStrategy and defaultStrategy) in ``./src/apcService/utilities/strategyUtil.js``, can you extent for more strategies to meet the requirement of more possibilities?
  - there are only two stake types (SHARON and RIB_EYE) in ``./src/measureService/index.js``, can you extend it to support more types of stake for the caculating in **APC** service?
  - Can you provide the unit test files for all services in this project?

- ## Reference
  - jest unit test tutorial (https://www.softwaretestinghelp.com/jest-testing-tutorial)
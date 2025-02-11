# EUCarInsights

Exploring European Car Data

## Prerequisites

- Python 3.11 or higher
- Google Chrome browser installed

## Installation

### 1. Get Source Code

```bash
git clone git@github.com:fangwangme/EUCarInsights.git
```

Or just unzip the given compressed zip file.

```bash
unzip EUCarInsights.zip
```

### 2. Navigate to the project directory

```bash
cd EUCarInsights
```

### 3. Copy config.txt to config.cfg and replace the settings with your own

```bash
cp config.txt config.ini
```

Edit config.ini and replace the placeholder values with your own settings.

```ini
[MYSQL]
SQL_HOST = 127.0.0.1
SQL_USER = username
SQL_PWD = password
DB_NAME = eucars


[PROXY_ADDR]
USER = user
PASSWORD = password  # The username and password for the proxy server
ADDRESS = 127.0.0.1:80  # The address of the proxy server


[PROXY_IP]
USER = user
PASSWORD = password # The username and password for the proxy server
ADDRESS = 127.0.0.1:80, # The address of the proxy server, it should be separated by comma


[RUNNING]
PROXY_TYPE = PROXY_ADDR # The type of the proxy server, it should be either PROXY_ADDR or PROXY_IP
RETRY_TIMES = 3 # The number of times to retry the request
WORKERS = 20 # The number of workers to scrape the data in multiple threads
IMAGE_WORKERS = 50 # The number of workers to download the images in multiple threads
```

### 4. Install the required Python packages

```bash
pip install -r requirements.txt
```

### 5. Import the database schema

>Note: You need to create a empty database named eucars before importing the schema.

```bash
mysql -u username -p eucars < eucars.sql
```

## Usage

### 1. Scrape the data of autoscout24

#### 1.1 Generate initial tasks

```bash
python main.py --mode task --source autoscout24
```

### 1.2. Scrape all cars from autoscout24

```bash
python main.py --mode listing --source autoscout24
```

>Note: The Whole process take about 5 hours (with 75 threads) to scrape all the cars from autoscout24. You may need to run the program in background with `nohup` or `screen` command.

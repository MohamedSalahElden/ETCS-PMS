# ETCS Project Management System

## Setup Instructions

1. **Install Dependencies**
    - Make sure you have Python installed
    - make venv
        ```bash
        python -m venv ..\test   
        ..\test\Scripts\activate
        ```
    - install requierments
        ```bash
        python.exe -m pip install --upgrade pip
        pip install -r .\requierments.txt
        ```
2. **Collect static**
    - Collect static files
        ```bash
        python manage.py collectstatic 
        ```


3. **Database Setup**
        
    - Create and  Apply database migrations
        ```bash
        python manage.py makemigrations 
        python manage.py migrate
        ```
    

4. **Running the Application**
    - Start the development server
        ```bash
        python.exe .\manage.py runserver
        ```

## Features
- Project management tools
- Task tracking
- User authentication
- Resource allocation

## Support
For any issues, please open a GitHub issue or contact the development team.
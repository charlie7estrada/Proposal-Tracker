import os

from app import create_app

app = create_app()

if __name__ == '__main__':
    # Dev entrypoint. Deploy behind a real WSGI server (gunicorn) instead.
    app.run(
        port=int(os.environ.get('PORT', '5000')),
        debug=os.environ.get('FLASK_DEBUG') == '1',
    )

"""Seed the database with a demo client and sample proposals.

Idempotent: re-running wipes the demo client's existing proposals (and their
files/messages) and recreates them, so you always get the same clean state.

    python seed.py

Demo login (client portal):  john@doecorp.com  /  password123
"""
import uuid
from datetime import datetime, timezone

from werkzeug.security import generate_password_hash

from app import create_app
from app.models import (
    Projects,
    ProposalFiles,
    ProposalMessages,
    Proposals,
    SubmissionNotes,
    Submissions,
    Users,
    db,
)

DEMO_EMAIL = 'john@doecorp.com'
DEMO_PASSWORD = 'password123'
TEAM_EMAIL = 'team@techsquad.com'


def dt(year, month, day):
    """A fixed timezone-aware timestamp, so seeded dates are stable."""
    return datetime(year, month, day, 12, 0, tzinfo=timezone.utc)


def get_or_create_user(email, **fields):
    user = db.session.query(Users).where(Users.email == email).first()
    if not user:
        user = Users(email=email)
        db.session.add(user)
    for key, value in fields.items():
        setattr(user, key, value)
    return user


def wipe_client_data(client, upload_dir):
    """Remove the client's submissions and everything hanging off them."""
    submissions = db.session.query(Submissions).where(
        (Submissions.client_id == client.id) | (Submissions.contact_email == client.email)
    ).all()

    for submission in submissions:
        for file in submission.files:
            (upload_dir / file.stored_name).unlink(missing_ok=True)
            db.session.delete(file)
        for message in submission.messages:
            db.session.delete(message)
        for note in submission.notes:
            db.session.delete(note)
        if submission.proposal:
            db.session.delete(submission.proposal)
        if submission.project:
            db.session.delete(submission.project)
        db.session.delete(submission)

    db.session.flush()


def make_file(submission_id, uploader_id, name, content_type, uploaded_on, upload_dir, kb=1):
    """Create a placeholder file on disk plus its metadata row."""
    ext = name.rsplit('.', 1)[-1].lower()
    stored_name = f'{uuid.uuid4()}.{ext}'
    path = upload_dir / stored_name
    path.write_bytes(b'x' * (kb * 1024))
    return ProposalFiles(
        submission_id=submission_id,
        uploader_id=uploader_id,
        original_name=name,
        stored_name=stored_name,
        content_type=content_type,
        size_bytes=path.stat().st_size,
        created_at=uploaded_on,
    )


def seed():
    app = create_app()
    with app.app_context():
        upload_dir = app.config['UPLOAD_DIR']
        upload_dir.mkdir(parents=True, exist_ok=True)

        # The team account authors "team" messages and uploads team files.
        team = get_or_create_user(
            TEAM_EMAIL,
            password_hash=generate_password_hash('teampass123'),
            role='MEMBER',
            first_name='Tech',
            last_name='Squad',
        )

        # The demo client whose portal we're populating.
        john = get_or_create_user(
            DEMO_EMAIL,
            password_hash=generate_password_hash(DEMO_PASSWORD),
            role='CLIENT',
            first_name='John',
            last_name='Doe',
            phone='555-555-5555',
            company_name='John Doe INC',
        )
        db.session.flush()

        wipe_client_data(john, upload_dir)

        # --- Active: E-commerce Website (matches the mockup) ---
        ecommerce = Submissions(
            contact_name='John Doe',
            contact_email=DEMO_EMAIL,
            project_type='Website',
            budget_range='$5000',
            timeline_weeks=12,
            description=(
                'This project involves the design and development of a modern '
                'e-commerce website tailored to showcase products, streamline '
                'online sales, and enhance the customer shopping experience.'
            ),
            status='NEW',
            client_id=john.id,
            created_at=dt(2026, 6, 15),
        )
        db.session.add(ecommerce)
        db.session.flush()
        db.session.add_all([
            Projects(submission_id=ecommerce.id, title='E-commerce Website', updated_at=dt(2026, 6, 18)),
            Proposals(submission_id=ecommerce.id, scope='Full e-commerce build', price=5000,
                      created_at=dt(2026, 6, 15), updated_at=dt(2026, 6, 18)),
            make_file(ecommerce.id, john.id, 'Logo.jpg', 'image/jpeg', dt(2026, 6, 17), upload_dir),
            make_file(ecommerce.id, john.id, 'Banner.jpg', 'image/jpeg', dt(2026, 6, 17), upload_dir),
            ProposalMessages(submission_id=ecommerce.id, sender_id=team.id,
                             body='Contact client to confirm start date', created_at=dt(2026, 6, 19)),
            ProposalMessages(submission_id=ecommerce.id, sender_id=john.id,
                             body='Sounds great, looking forward to getting started!', created_at=dt(2026, 6, 19)),
        ])

        # --- Active: Mobile App (has a team-uploaded file the client can't delete) ---
        mobile = Submissions(
            contact_name='John Doe',
            contact_email=DEMO_EMAIL,
            project_type='Mobile App',
            budget_range='$12,000',
            timeline_weeks=24,
            description=(
                'A companion mobile app for iOS and Android that lets customers '
                'browse the catalog, track orders, and receive push notifications.'
            ),
            status='CONTACTED',
            client_id=john.id,
            created_at=dt(2026, 7, 1),
        )
        db.session.add(mobile)
        db.session.flush()
        db.session.add_all([
            Projects(submission_id=mobile.id, title='Mobile App', updated_at=dt(2026, 7, 2)),
            Proposals(submission_id=mobile.id, scope='iOS + Android companion app', price=12000,
                      created_at=dt(2026, 7, 1), updated_at=dt(2026, 7, 2)),
            make_file(mobile.id, team.id, 'Wireframes.pdf', 'application/pdf', dt(2026, 7, 1), upload_dir, kb=2),
            ProposalMessages(submission_id=mobile.id, sender_id=team.id,
                             body='Wireframes attached - design review starts this week', created_at=dt(2026, 7, 2)),
        ])

        # --- Completed: Brand Refresh ---
        brand = Submissions(
            contact_name='John Doe',
            contact_email=DEMO_EMAIL,
            project_type='Design',
            budget_range='$3000',
            timeline_weeks=4,
            description='A refresh of the company brand: updated logo, color palette, and a style guide.',
            status='WON',
            client_id=john.id,
            created_at=dt(2026, 5, 20),
        )
        db.session.add(brand)
        db.session.flush()
        db.session.add_all([
            Projects(submission_id=brand.id, title='Brand Refresh', updated_at=dt(2026, 5, 30)),
            Proposals(submission_id=brand.id, scope='Logo + style guide', price=3000,
                      created_at=dt(2026, 5, 20), updated_at=dt(2026, 5, 30)),
            make_file(brand.id, john.id, 'StyleGuide.pdf', 'application/pdf', dt(2026, 5, 28), upload_dir, kb=4),
            ProposalMessages(submission_id=brand.id, sender_id=team.id,
                             body='Final style guide delivered. Thanks for working with us!', created_at=dt(2026, 5, 30)),
        ])

        # --- Declined: SEO Audit ---
        seo = Submissions(
            contact_name='John Doe',
            contact_email=DEMO_EMAIL,
            project_type='SEO',
            budget_range='Under $5k',
            timeline_weeks=3,
            description='A one-time SEO audit of the existing marketing site with a prioritized fix list.',
            status='LOST',
            client_id=john.id,
            created_at=dt(2026, 4, 10),
        )
        db.session.add(seo)
        db.session.flush()
        db.session.add_all([
            Projects(submission_id=seo.id, title='SEO Audit', updated_at=dt(2026, 4, 15)),
            Proposals(submission_id=seo.id, scope='One-time SEO audit', price=2500,
                      created_at=dt(2026, 4, 10), updated_at=dt(2026, 4, 15)),
        ])

        db.session.commit()

        print('Seeded demo data.')
        print(f'  Client login:  {DEMO_EMAIL}  /  {DEMO_PASSWORD}')
        print('  Proposals: 2 active, 1 completed, 1 declined')


if __name__ == '__main__':
    seed()

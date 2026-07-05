import uuid
from datetime import date, datetime, timezone

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import (
    Boolean, Column, Date, DateTime, Float, ForeignKey, Integer, Interval,
    JSON, LargeBinary, Numeric, String, Table, Text,
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

def _new_uuid() -> str:
    """Generate a fresh UUIDv4 string for a primary key."""
    return str(uuid.uuid4())


def _utcnow() -> datetime:
    """Lambda-friendly default for created_at columns. Evaluated per row."""
    return datetime.now(timezone.utc)

class Base(DeclarativeBase):
    pass


db = SQLAlchemy(model_class=Base)



class Users(Base):
    __tablename__ = 'users'

    id: Mapped[str] = mapped_column(String, primary_key=True, default=_new_uuid)
    email: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(300), nullable=False)
    role: Mapped[str] = mapped_column(String(50), nullable=False, default='MEMBER')
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utcnow)


class Submissions(Base):
    __tablename__ = 'submissions'

    id: Mapped[str] = mapped_column(String, primary_key=True, default=_new_uuid)
    contact_name: Mapped[str] = mapped_column(String(100), nullable=False)
    contact_email: Mapped[str] = mapped_column(String(100), nullable=False)
    project_type: Mapped[str] = mapped_column(String(50), nullable=False)
    budget_range: Mapped[str] = mapped_column(String(50), nullable=False)
    timeline_weeks: Mapped[int] = mapped_column(Integer, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default='NEW') ## NEW, CONTACTED, PROPOSAL_SENT, WON, lOST
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utcnow)

    notes: Mapped[list['SubmissionNotes']] = relationship('SubmissionNotes', back_populates='submission')
    proposal: Mapped['Proposals'] = relationship('Proposals', back_populates='submission', uselist=False)
    project: Mapped['Projects'] = relationship('Projects', back_populates='submission', uselist=False)

class SubmissionNotes(Base):
    __tablename__ = 'submission_notes'

    id: Mapped[str] = mapped_column(String, primary_key=True, default=_new_uuid)
    submission_id: Mapped[str] = mapped_column(String, ForeignKey('submissions.id'), nullable=False)
    author_id: Mapped[str] = mapped_column(String, ForeignKey('users.id'), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utcnow)

    submission: Mapped['Submissions'] = relationship('Submissions', back_populates='notes')


class Proposals(Base):
    __tablename__ = 'proposals'

    id: Mapped[str] = mapped_column(String, primary_key=True, default=_new_uuid)
    submission_id: Mapped[str] = mapped_column(String, ForeignKey('submissions.id'), nullable=False, unique=True)
    scope: Mapped[str] = mapped_column(Text, nullable=False)
    price: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False, default=0)
    expected_deadline: Mapped[date] = mapped_column(Date, nullable=True)
    feedback_timeframe: Mapped[str] = mapped_column(String(100), nullable=True)
    pdf_storage_url: Mapped[str] = mapped_column(String(300), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utcnow)

    submission: Mapped['Submissions'] = relationship('Submissions', back_populates='proposal')


class Projects(Base):
    __tablename__ = 'projects'

    id: Mapped[str] = mapped_column(String, primary_key=True, default=_new_uuid)
    submission_id: Mapped[str] = mapped_column(String, ForeignKey('submissions.id'), nullable=False, unique=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    kanban_status: Mapped[str] = mapped_column(String(20), nullable=False, default='Backlog')
    board_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utcnow, onupdate=_utcnow)

    submission: Mapped['Submissions'] = relationship('Submissions', back_populates='project')


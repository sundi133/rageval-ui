from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Float, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime

Base = declarative_base()


class Dataset(Base):
    __tablename__ = "datasets"

    id = Column(Integer, primary_key=True, index=True)
    gen_id = Column(String, index=True)
    name = Column(String, index=True)
    userid = Column(String)
    orgid = Column(String)
    type = Column(String)
    chat_type = Column(String)
    sample_size = Column(Integer)
    number_of_questions = Column(Integer)
    chunk_size = Column(Integer)
    reference_chunk_max_distance = Column(Integer)
    ts = Column(DateTime, default=datetime.utcnow)
    dataset_type = Column(String)
    model_name = Column(String)
    # Define relationships
    qa_data = relationship("QAData", back_populates="dataset")
    evaluations = relationship("Evaluation", back_populates="dataset")


class QAData(Base):
    __tablename__ = "qa_data"

    id = Column(Integer, primary_key=True, index=True)
    userid = Column(String)
    orgid = Column(String)
    dataset_id = Column(Integer, ForeignKey("datasets.id"))
    ts = Column(DateTime, default=datetime.utcnow)
    chat_messages = Column(JSON)
    reference_chunk = Column(String)

    # Define relationships
    dataset = relationship("Dataset", back_populates="qa_data")
    evaluations = relationship("Evaluation", back_populates="qa_data")


class LLMEndpoint(Base):
    __tablename__ = "llm_endpoints"

    id = Column(Integer, primary_key=True, index=True)
    userid = Column(String)
    orgid = Column(String)
    name = Column(String, index=True)
    endpoint_url = Column(String)
    ts = Column(DateTime, default=datetime.utcnow)
    evaluations = relationship("Evaluation", back_populates="llm_endpoint")


class Evaluation(Base):
    __tablename__ = "evaluations"

    id = Column(Integer, primary_key=True, index=True)
    userid = Column(String)
    orgid = Column(String)
    dataset_id = Column(Integer, ForeignKey("datasets.id"))
    llm_endpoint_id = Column(Integer, ForeignKey("llm_endpoints.id"))
    qa_data_id = Column(Integer, ForeignKey("qa_data.id"))
    ts = Column(DateTime, default=datetime.utcnow)
    score = Column(Float)

    # Define relationships
    dataset = relationship("Dataset", back_populates="evaluations")
    llm_endpoint = relationship("LLMEndpoint", back_populates="evaluations")
    qa_data = relationship("QAData", back_populates="evaluations")

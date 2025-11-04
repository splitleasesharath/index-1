/**
 * Adapted styles for SearchScheduleSelector to match Split Lease site design
 * Removes the purple gradient background and adapts to hero section styling
 */
import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
  user-select: none;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;

export const SelectorRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  justify-content: center;
  width: 100%;
`;

export const CalendarIcon = styled.div`
  font-size: 32px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  flex-shrink: 0;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const DaysGrid = styled.div`
  display: flex;
  gap: 0.4rem;
  flex-wrap: nowrap;
`;

export const DayCell = styled(motion.button)`
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  font-family: "Inter", Helvetica, Arial, sans-serif;
  border: none;
  border-radius: 8px;
  cursor: ${props => props.$isDragging ? 'grabbing' : 'pointer'};
  transition: all 0.2s ease-in-out;
  background-color: ${props => props.$isSelected ? '#4B47CE' : '#b2b2b2'} !important;
  color: #ffffff !important;

  /* Error state - red gradient background */
  ${props => props.$hasError && props.$errorStyle === 1 && props.$isSelected && `
    background: linear-gradient(135deg, #f93a5a 0%, #d32f2f 100%) !important;
    color: #ffffff !important;
    box-shadow: 0 4px 12px rgba(249, 58, 90, 0.4) !important;
    animation: pulse-error 1.5s ease-in-out infinite;

    @keyframes pulse-error {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
  `}

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props =>
      props.$isSelected
        ? '0 6px 16px rgba(75, 71, 206, 0.6)'
        : '0 4px 12px rgba(0, 0, 0, 0.15)'
    };
  }

  &:active {
    transform: translateY(0);
  }

  &:focus-visible {
    outline: 3px solid rgba(75, 71, 206, 0.6);
    outline-offset: 2px;
  }

  @media (max-width: 768px) {
    width: 38px;
    height: 38px;
    font-size: 15px;
    border-radius: 8px;
  }

  @media (max-width: 480px) {
    width: 32px;
    height: 32px;
    font-size: 13px;
  }
`;

export const InfoContainer = styled.div`
  min-height: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;

export const InfoText = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.95);
  text-align: center;

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

export const ResetButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.9);
  font-size: 13px;
  font-weight: 500;
  text-decoration: underline;
  cursor: pointer;
  padding: 4px 8px;
  transition: all 0.2s ease;

  &:hover {
    color: #ffffff;
    text-decoration: none;
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const ErrorPopup = styled(motion.div)`
  position: absolute;
  top: -80px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 280px;

  @media (max-width: 768px) {
    min-width: 240px;
    padding: 12px 20px;
  }
`;

export const ErrorIcon = styled.span`
  font-size: 24px;
  flex-shrink: 0;
`;

export const ErrorMessage = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: #d32f2f;
  line-height: 1.4;
`;

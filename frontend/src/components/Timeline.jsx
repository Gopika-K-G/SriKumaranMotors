import React from 'react';
import '../styles/Timeline.css';

export default function Timeline({ tracking }) {
  const steps = [
    { label: 'Confirmed', key: 'confirmed' },
    { label: 'Packed',    key: 'packed'    },
    { label: 'Delivered', key: 'delivered' },
  ];

  return (
    <div className="timeline">
      {steps.map((step, idx) => (
        <div key={step.key} className="timeline-step">
          <div className={`circle ${tracking[step.key] ? 'done' : ''}`} />
          {idx < steps.length - 1 && <div className="bar" />}
          <span className={`label ${tracking[step.key] ? 'done' : ''}`}>
            {step.label}
          </span>
        </div>
      ))}
    </div>
  );
}

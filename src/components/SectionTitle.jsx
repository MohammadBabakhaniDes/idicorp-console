
export default function SectionTitle({
    eyebrow,
    title,
    description,
    action,
  }) {
    return (
      <div className="section-heading">
        <div>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h2>{title}</h2>
          {description && <p className="section-description">{description}</p>}
        </div>
  
        {action && <div className="section-heading-action">{action}</div>}
      </div>
    );
  }
  
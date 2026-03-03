import styles from './MissionSection.module.css';

const FlagIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
    <line x1="4" y1="22" x2="4" y2="15" />
  </svg>
);

const EyeIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const DiamondIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 9 12 22 22 9 12 2" />
    <line x1="12" y1="2" x2="12" y2="22" />
    <line x1="2" y1="9" x2="22" y2="9" />
    <line x1="2" y1="9" x2="12" y2="22" />
    <line x1="22" y1="9" x2="12" y2="22" />
  </svg>
);

type Side = "right" | "left";

interface Item {
  id: number;
  title: string;
  text: string;
  icon: React.ReactNode;
  side: Side; // which side holds the ICON (card is on the opposite side)
}

const items: Item[] = [
  {
    id: 1,
    title: "Mission",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat",
    icon: <FlagIcon />,
    side: "left",
  },
  {
    id: 2,
    title: "Vision",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat",
    icon: <EyeIcon />,
    side: "right",
  },
  {
    id: 3,
    title: "Values",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat",
    icon: <DiamondIcon />,
    side: "left",
  },
]; 

export function MissionSection() {

  return (
    <section className={styles.section}>
      <p></p>
      <h2></h2>

      <div className={styles.timeline}>
        <div className={styles.timelineLine}/>

        {items.map((item) => {
          const isIconLeft = item.side === "right";
          const rowClass = isIconLeft ? styles.rowRight : styles.rowLeft;

          return (
            <div key={item.id} className={`${styles.row} ${rowClass}`}>
              {/* Icon side */}
              <div className={styles.iconSide}>
                <div className={styles.iconBox}>{item.icon}</div>
              </div>

              {/* Center dot */}
              <div className={styles.dot} />

              {/* Card side */}
              <div className={styles.cardSide}>
                <div className={styles.card}>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <p className={styles.cardText}>{item.text}</p>
                </div>
              </div>
            </div>
          );
        })}

      </div>
    </section>
  );
}
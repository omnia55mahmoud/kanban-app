'use client';

import Search from "@/components/Search";
import styles from "./page.module.css";
import TaskCard from "@/components/TaskCard";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.header}>
          <Search />
        </div>
        <div className={styles.body}>
          <div className={styles.kanbanBoard}>
            <div className={styles.column}>
              <div className={styles.columnHeader}>Backlog</div>
              <div className={styles.columnContent}>
                <TaskCard
                  title="Sample Task"
                  description="This is a sample task description"
                  onEdit={() => console.log('Edit clicked')}
                  onDelete={() => console.log('Delete clicked')}
                />
              </div>
            </div>
            <div className={styles.column}>
              <div className={styles.columnHeader}>In Progress</div>
              <div className={styles.columnContent}>
                 <TaskCard
                  title="Sample Task"
                  description="This is a sample task description"
                  onEdit={() => console.log('Edit clicked')}
                  onDelete={() => console.log('Delete clicked')}
                />
                 <TaskCard
                  title="Sample Task"
                  description="This is a sample task description"
                  onEdit={() => console.log('Edit clicked')}
                  onDelete={() => console.log('Delete clicked')}
                />
              </div>
            </div>
            <div className={styles.column}>
              <div className={styles.columnHeader}>Review</div>
              <div className={styles.columnContent}>
                 <TaskCard
                  title="Sample Task"
                  description="This is a sample task description"
                  onEdit={() => console.log('Edit clicked')}
                  onDelete={() => console.log('Delete clicked')}
                />
                 <TaskCard
                  title="Sample Task"
                  description="This is a sample task description"
                  onEdit={() => console.log('Edit clicked')}
                  onDelete={() => console.log('Delete clicked')}
                />
                 <TaskCard
                  title="Sample Task"
                  description="This is a sample task description"
                  onEdit={() => console.log('Edit clicked')}
                  onDelete={() => console.log('Delete clicked')}
                />
              </div>
            </div>
            <div className={styles.column}>
              <div className={styles.columnHeader}>Done</div>
              <div className={styles.columnContent}>
                 <TaskCard
                  title="Sample Task"
                  description="This is a sample task description"
                  onEdit={() => console.log('Edit clicked')}
                  onDelete={() => console.log('Delete clicked')}
                />
                 <TaskCard
                  title="Sample Task"
                  description="This is a sample task description"
                  onEdit={() => console.log('Edit clicked')}
                  onDelete={() => console.log('Delete clicked')}
                />
                 <TaskCard
                  title="Sample Task"
                  description="This is a sample task description"
                  onEdit={() => console.log('Edit clicked')}
                  onDelete={() => console.log('Delete clicked')}
                />
                 <TaskCard
                  title="Sample Task"
                  description="This is a sample task description"
                  onEdit={() => console.log('Edit clicked')}
                  onDelete={() => console.log('Delete clicked')}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div>
      <Head>
        <title>WASD Cheats</title>
      </Head>

      <div className={styles.header_container}>
        <video className={styles.header_video} autoPlay loop muted>
            <source src="/home_header.mp4" type="video/mp4"/>
        </video>
        <div className={styles.header_left}>
          <h1 className={styles.header_wasd}>WASD</h1>
          <p>A Cheating commuinty.</p>
          <div>
            <button className={styles.header_button}>Join Now!</button>
            <button className={`${styles.header_button} ${styles.pink}`}>Features</button>
          </div>
        </div>
      </div>

      <div className={styles.pricing_container}>
        <h1>Pricing</h1>
      </div>

    </div>
  )
}

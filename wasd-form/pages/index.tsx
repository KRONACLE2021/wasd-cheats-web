import Head from 'next/head';
import styles from '../styles/Home.module.css';
import useApiCheck from '../requests/useApiCheck';
import PricingCard from '../components/home/PricingCard';

export default  function Home() {

  let status = useApiCheck();
 
  if(status == "offline") {
    console.log("[API ERROR] Could not connect to wasd api.")
  }

  return (
    <div>
      <Head>
        <title>WASD - A Cheating Community</title>
      </Head>

      <div className={styles.header_container}>
        <div className={styles.header_left}>
          <h1 className={styles.header_wasd}><span style={{ color: "var(--purple)"}}>Enhance</span> your gameplay.</h1>
          <p className={styles.header_slogan}>Welcome to WASD, we provide quality cheating software for games.</p>
          <div>
            <button className={styles.header_button}>Join Now!</button>
            <button className={`${styles.header_button} ${styles.pink}`}>Features</button>
          </div>
        </div>
        <div className={styles.header_right}>
          <img src={"/wasd_frontpage.png"}></img>
        </div>
      </div>

      { /* Pricing Section */ }
      <div className={styles.pricing_container}>
      <div className={styles.small_spacer}></div>
        <div className={styles.pricing_header}>
          <h1>Pricing Plans</h1>
          <p>Filler Text Here</p>
        </div>
        <div className={styles.small_spacer}></div>
        <div className={styles.pricing_cards}>
          <PricingCard name={"1 Month EFT"} selling_points={["1 Month of WASD", "Discord Role"]} price={"15"} image={"/filler_image.png"} currency={"USD"}></PricingCard>
          <PricingCard name={"1 Month EFT"} selling_points={["1 Month of WASD", "Discord Role"]} price={"15"} image={"/filler_image.png"} currency={"USD"}></PricingCard>
          <PricingCard name={"1 Month EFT"} selling_points={["1 Month of WASD", "Discord Role"]} price={"15"} image={"/filler_image.png"} currency={"USD"}></PricingCard>
        </div>
        <div className={styles.spacer}></div>
      </div>

    </div>
  )
}

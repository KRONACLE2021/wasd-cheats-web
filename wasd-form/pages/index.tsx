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

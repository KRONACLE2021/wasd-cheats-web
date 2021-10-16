import react, { useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import useApiCheck from '../requests/useApiCheck';
import ReviewCard from '../components/home/TestomonialCard';
import router from 'next/router';
import HeaderOG from '../components/shared/HeaderOG';

export default  function Home() {

  let status = useApiCheck();
  let [currentSlide, setCurrentSlide] = useState<number>(0);

  const homeSlideShowCards = [
      <ReviewCard 
        profile_picture={"http://localhost:8080/api/v1/uploads/file/bbe90bf1-8daf-4eed-80f4-f4b055cb0120"}
        username={"GreyBurger"}
        review={"I'd say the aim works great , there's 0 performance drops , and played almost the entire day and had no issued no crashes or anything at all. Worked really smooth and to be honest comparing to other products on the market , you'll realise this has significantly lesser crashes."}
    />
  ]
 
  if(status == "offline") {
    console.log("[API ERROR] Could not connect to wasd api.")
  }

  return (
    <div>
      <HeaderOG
        title={"WASD Cheats - Home"}
      />

      <div className={styles.header_container}>
        <div className={styles.header_left}>
          <h1 className={styles.header_wasd}><span style={{ color: "var(--purple)"}}>Enhance</span> your gameplay.</h1>
          <p className={styles.header_slogan}>Welcome to WASD, we provide quality cheating software for games.</p>
          <div>
            <button className={styles.header_button} onClick={() => router.push("/login")}>Join Now!</button>
            <button className={`${styles.header_button} ${styles.pink}`}>Shop</button>
          </div>
        </div>
        <div className={styles.header_right}>
          <img src={"/wasd_frontpage.png"}></img>
        </div>
      </div>

      { /* Used to be Pricing Section, Now is just a join pannel */ }
      <div className={styles.pricing_container}>
      <div className={styles.small_spacer}></div>
        <div className={styles.pricing_header}>
          <h1>Join 150+ Members</h1>
          <p>WASD is a diverse community of cheaters and like minded people. What are you waiting for? Join now!</p>
          <button className={`${styles.header_button} ${styles.pink}`}  onClick={() => router.push("/register")}>Join Now</button>
        </div>
        <div className={styles.spacer}></div>
      </div>

      <div className={styles.home_container}>
        <div className={styles.home_container_centered}>
          <h1>What other people are saying</h1>
          <div className={styles.home_slideshow}>
            {homeSlideShowCards[currentSlide]}
            <div className={styles.slideshow_dots}>
              {homeSlideShowCards.map((element, index) => {
                return <div className={`${currentSlide == index ? styles.active_dot : ""}`} onClick={() => setCurrentSlide(index)}></div>
              })}
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

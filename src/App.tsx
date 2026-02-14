import React, { useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import * as THREE from "three";
import "./App.css";
import adeola from "./assets/adeola.jpg";

// Error Boundary for 3D Canvas
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.log("3D Canvas Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// 3D Floating Heart Component
function FloatingHeart({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.5;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={2}>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          color="#ff6b9d"
          emissive="#ff1744"
          emissiveIntensity={0.2}
        />
      </mesh>
    </Float>
  );
}

// 3D Rotating Heart Shape
function RotatingHeart() {
  const heartRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (heartRef.current) {
      heartRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={heartRef}>
      <mesh position={[0, 0.3, 0]}>
        <torusGeometry args={[1, 0.3, 16, 100]} />
        <meshStandardMaterial
          color="#ff6b9d"
          metalness={0.8}
          roughness={0.2}
          emissive="#ff1744"
          emissiveIntensity={0.3}
        />
      </mesh>
      <mesh position={[0, -0.5, 0]} scale={[1.2, 1.5, 1]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial
          color="#ff6b9d"
          metalness={0.8}
          roughness={0.2}
          emissive="#ff1744"
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  );
}

// 3D Floating Polaroid with Her Photo
function FloatingPolaroid() {
  const polaroidRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useFrame((state) => {
    if (polaroidRef.current) {
      // Gentle floating animation
      polaroidRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
      // Gentle rotation
      if (!hovered) {
        polaroidRef.current.rotation.y =
          Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
      } else {
        // Spin when hovered
        polaroidRef.current.rotation.y += 0.02;
      }
    }
  });

  // Load texture (placeholder - replace with actual photo path)
  const texture = new THREE.TextureLoader().load(adeola);

  // Responsive positioning
  const position: [number, number, number] = isMobile
    ? [0, -2, 3] // Mobile: centered and forward, lower
    : [3.5, 0, 2]; // Desktop: to the right

  const scale = isMobile ? 0.8 : 1; // Slightly smaller on mobile

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <group
        ref={polaroidRef}
        position={position}
        scale={scale}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onClick={() => setHovered(!hovered)} // Toggle on click/tap for mobile
      >
        {/* Polaroid frame (white border) */}
        <mesh>
          <boxGeometry args={[2, 2.4, 0.1]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>

        {/* Photo */}
        <mesh position={[0, 0.15, 0.06]}>
          <planeGeometry args={[1.8, 1.8]} />
          <meshStandardMaterial map={texture} />
        </mesh>

        {/* Shadow effect */}
        <mesh position={[0, 0, -0.06]} rotation={[0, 0, 0]}>
          <boxGeometry args={[2.05, 2.45, 0.05]} />
          <meshStandardMaterial color="#e0e0e0" />
        </mesh>
      </group>
    </Float>
  );
}

// 3D Scene Component
function Scene3D() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />

      <RotatingHeart />
      <FloatingPolaroid />
      <FloatingHeart position={[-3, 0, 0]} />
      <FloatingHeart position={[3, 1, -2]} />
      <FloatingHeart position={[0, -1, 2]} />
      <FloatingHeart position={[-2, 2, 1]} />
      <FloatingHeart position={[2, -2, -1]} />

      <OrbitControls enableZoom={false} enablePan={false} />
    </>
  );
}

// Countdown Timer Component
function CountdownTimer() {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const startDate = new Date("2025-11-30T00:00:00");

    const updateCountdown = () => {
      const now = new Date();
      const diff = now.getTime() - startDate.getTime();

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setDays(d);
      setHours(h);
      setMinutes(m);
      setSeconds(s);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000); // Update every second
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="countdown-section">
      <h3 className="countdown-title">Our Journey Together</h3>
      <div className="countdown-container">
        <div className="countdown-box">
          <div className="countdown-number">{days}</div>
          <div className="countdown-label">Days</div>
        </div>
        <div className="countdown-box">
          <div className="countdown-number">{hours}</div>
          <div className="countdown-label">Hours</div>
        </div>
        <div className="countdown-box">
          <div className="countdown-number">{minutes}</div>
          <div className="countdown-label">Minutes</div>
        </div>
        <div className="countdown-box">
          <div className="countdown-number">{seconds}</div>
          <div className="countdown-label">Seconds</div>
        </div>
      </div>
    </div>
  );
}

// Reasons Carousel Component
function ReasonsCarousel() {
  const reasons = [
    {
      title: "Your Smile",
      text: "It lights up my entire world and makes every moment brighter",
    },
    {
      title: "Your Kindness",
      text: "The way you care for others inspires me to be a better person",
    },
    {
      title: "Your Laughter",
      text: "It's the most beautiful sound I've ever heard",
    },
    {
      title: "Your Support",
      text: "You believe in me even when I don't believe in myself",
    },
    { title: "Your Love", text: "It's the greatest gift I've ever received" },
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % reasons.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="carousel-container">
      {reasons.map((reason, index) => (
        <div
          key={index}
          className={`carousel-slide ${index === current ? "active" : index < current ? "prev" : "next"}`}
        >
          <div className="carousel-content">
            <h4 className="carousel-title">{reason.title}</h4>
            <p className="carousel-text">{reason.text}</p>
          </div>
        </div>
      ))}
      <div className="carousel-dots">
        {reasons.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`carousel-dot ${index === current ? "active" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}

// Photo Gallery Component
// 1. Message in a Bottle
function MessageInBottle() {
  const [openedBottles, setOpenedBottles] = useState<number[]>([]);

  const bottles = [
    { message: "I promise to always make you laugh, even on the hardest days" },
    { message: "Every adventure is better with you by my side" },
    { message: "You are my today and all of my tomorrows" },
    { message: "I'll love you in every lifetime, in every universe" },
    { message: "Thank you for being my safe place and my greatest adventure" },
    { message: "With you, I've found my forever home" },
  ];

  const toggleBottle = (index: number) => {
    setOpenedBottles((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  return (
    <div className="bottle-ocean">
      <div className="waves"></div>
      <div className="bottles-container">
        {bottles.map((bottle, index) => (
          <div
            key={index}
            className={`bottle ${openedBottles.includes(index) ? "opened" : ""}`}
            onClick={() => toggleBottle(index)}
            style={{ animationDelay: `${index * 0.3}s` }}
          >
            <div className="bottle-glass">🍾</div>
            <div className="bottle-message">
              <p>{bottle.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 2. Constellation of Us
function ConstellationOfUs() {
  const [selectedStar, setSelectedStar] = useState<number | null>(null);

  const stars = [
    { x: 20, y: 30, date: "First Date", memory: "The day everything changed" },
    {
      x: 45,
      y: 20,
      date: "First Kiss",
      memory: "Under the stars, time stood still",
    },
    { x: 70, y: 40, date: "First Trip", memory: "Adventures began with you" },
    {
      x: 30,
      y: 60,
      date: "First 'I Love You'",
      memory: "Three words that meant everything",
    },
    { x: 65, y: 70, date: "Our Song", memory: "The melody of our love story" },
    {
      x: 50,
      y: 50,
      date: "Today",
      memory: "Every moment is precious with you",
    },
  ];

  return (
    <div className="constellation-map">
      <div className="shooting-stars">
        <div className="shooting-star"></div>
        <div className="shooting-star"></div>
        <div className="shooting-star"></div>
      </div>

      {stars.map((star, index) => (
        <div
          key={index}
          className={`star ${selectedStar === index ? "active" : ""}`}
          style={{ left: `${star.x}%`, top: `${star.y}%` }}
          onClick={() => setSelectedStar(selectedStar === index ? null : index)}
        >
          <div className="star-glow">✨</div>
          {selectedStar === index && (
            <div className="star-info">
              <h4>{star.date}</h4>
              <p>{star.memory}</p>
            </div>
          )}
        </div>
      ))}

      <svg className="constellation-lines" width="100%" height="100%">
        {stars.map((star, index) => {
          if (index < stars.length - 1) {
            const next = stars[index + 1];
            return (
              <line
                key={index}
                x1={`${star.x}%`}
                y1={`${star.y}%`}
                x2={`${next.x}%`}
                y2={`${next.y}%`}
                stroke="rgba(255, 255, 255, 0.3)"
                strokeWidth="2"
              />
            );
          }
          return null;
        })}
      </svg>
    </div>
  );
}

// 3. Love Fortune Cookies
function LoveFortuneCookies() {
  const [crackedCookies, setCrackedCookies] = useState<number[]>([]);

  const fortunes = [
    "Your love story will be told for generations",
    "Adventure awaits you both around every corner",
    "Laughter will fill your days and warmth your nights",
    "Together, you will create a beautiful life",
    "Your bond grows stronger with each passing day",
    "Love like yours is once in a lifetime",
  ];

  const crackCookie = (index: number) => {
    if (!crackedCookies.includes(index)) {
      setCrackedCookies((prev) => [...prev, index]);
    }
  };

  return (
    <div className="fortune-cookies-container">
      <div className="cookies-grid">
        {fortunes.map((fortune, index) => (
          <div
            key={index}
            className={`fortune-cookie ${crackedCookies.includes(index) ? "cracked" : ""}`}
            onClick={() => crackCookie(index)}
          >
            <div className="cookie-whole">🥠</div>
            <div className="cookie-paper">
              <p>{fortune}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 4. Growing Love Garden
function GrowingLoveGarden() {
  const [wateredFlowers, setWateredFlowers] = useState<number[]>([]);

  const flowers = [
    { type: "🌹", name: "Trust", color: "#ff6b9d" },
    { type: "🌺", name: "Passion", color: "#ff1744" },
    { type: "🌸", name: "Tenderness", color: "#f9a8d4" },
    { type: "🌻", name: "Joy", color: "#fbbf24" },
    { type: "🌷", name: "Grace", color: "#ec4899" },
    { type: "💐", name: "Forever", color: "#db2777" },
  ];

  const waterFlower = (index: number) => {
    if (!wateredFlowers.includes(index)) {
      setWateredFlowers((prev) => [...prev, index]);
    }
  };

  return (
    <div className="love-garden">
      <div className="garden-soil"></div>
      <div className="watering-can">💧 Click flowers to help them bloom</div>
      <div className="flowers-row">
        {flowers.map((flower, index) => (
          <div
            key={index}
            className={`flower-pot ${wateredFlowers.includes(index) ? "bloomed" : ""}`}
            onClick={() => waterFlower(index)}
          >
            <div className="flower-bloom" style={{ color: flower.color }}>
              {flower.type}
            </div>
            <div className="flower-stem"></div>
            <div className="flower-pot-base"></div>
            <div className="flower-label">{flower.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 5. Heart Lock Bridge
function HeartLockBridge() {
  const [unlockedLocks, setUnlockedLocks] = useState<number[]>([]);

  const locks = [
    { initials: "U + Me", promise: "Forever and always" },
    { initials: "♥", promise: "Through thick and thin" },
    { initials: "∞", promise: "Infinite love" },
    { initials: "2024", promise: "Our best year yet" },
    { initials: "4ever", promise: "Never letting go" },
    { initials: "True Love", promise: "In this life and the next" },
  ];

  const unlockLock = (index: number) => {
    setUnlockedLocks((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  return (
    <div className="love-lock-bridge">
      <div className="bridge-background"></div>
      <div className="locks-grid">
        {locks.map((lock, index) => (
          <div
            key={index}
            className={`love-lock ${unlockedLocks.includes(index) ? "unlocked" : ""}`}
            onClick={() => unlockLock(index)}
          >
            <div className="lock-body">
              <div className="lock-icon">
                {unlockedLocks.includes(index) ? "🔓" : "🔒"}
              </div>
              <div className="lock-initials">{lock.initials}</div>
            </div>
            {unlockedLocks.includes(index) && (
              <div className="lock-promise">
                <p>{lock.promise}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Bucket List Component
function BucketList() {
  const dreams = [
    { icon: "✈️", text: "Travel to Paris together" },
    { icon: "🏖️", text: "Watch sunrise on a beach" },
    { icon: "🎭", text: "See a Broadway show" },
    { icon: "🏔️", text: "Hike a mountain peak" },
    { icon: "🍝", text: "Cook a fancy dinner together" },
    { icon: "🌌", text: "Stargaze under the night sky" },
  ];

  return (
    <div className="bucket-grid">
      {dreams.map((dream, index) => (
        <div
          key={index}
          className="bucket-item"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="bucket-icon">{dream.icon}</div>
          <p className="bucket-text">{dream.text}</p>
        </div>
      ))}
    </div>
  );
}

// Interactive Message Reveal
function MessageReveal() {
  const [revealed, setRevealed] = useState<number[]>([]);

  const messages = [
    "You make me smile every single day",
    "I'm grateful for every moment with you",
    "You're my best friend and soulmate",
    "I can't wait for our future together",
  ];

  const toggleReveal = (index: number) => {
    setRevealed((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  return (
    <div className="message-grid">
      {messages.map((message, index) => (
        <button
          key={index}
          onClick={() => toggleReveal(index)}
          className="message-card"
        >
          <div
            className={`message-front ${revealed.includes(index) ? "hidden" : ""}`}
          >
            <span className="message-heart">💖</span>
          </div>
          <div
            className={`message-back ${revealed.includes(index) ? "visible" : ""}`}
          >
            <p>{message}</p>
          </div>
        </button>
      ))}
    </div>
  );
}

// Main App Component
export default function ValentineWebsite() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="app">
      {/* Floating Hearts Background */}
      <div className="floating-hearts">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="floating-heart"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${5 + Math.random() * 10}s`,
              animationDelay: `${Math.random() * 5}s`,
              fontSize: `${20 + Math.random() * 30}px`,
            }}
          >
            ❤️
          </div>
        ))}
      </div>

      {/* Hero Section with 3D */}
      <section className="hero-section">
        <div className="hero-canvas">
          <ErrorBoundary fallback={<div className="canvas-fallback" />}>
            <Canvas
              camera={{ position: [0, 0, 8], fov: 60 }}
              gl={{
                antialias: true,
                alpha: true,
                powerPreference: "high-performance",
              }}
              onCreated={({ gl }) => {
                gl.setClearColor(0x000000, 0);
              }}
            >
              <Scene3D />
            </Canvas>
          </ErrorBoundary>
        </div>

        <div
          className="hero-content"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
            opacity: 1 - scrollY / 500,
          }}
        >
          <h1 className="hero-title">Happy Valentine's Day</h1>
          <p className="hero-subtitle">To the love of my life</p>
          <button
            onClick={() =>
              window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
            }
            className="hero-button"
          >
            Explore Our Love Story ❤️
          </button>
        </div>

        <div className="scroll-indicator">
          <svg
            className="scroll-arrow"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </section>

      {/* Countdown Timer Section */}
      <section className="section countdown-bg">
        <div className="container">
          <CountdownTimer />
        </div>
      </section>

      {/* Love Letter Section */}
      <section className="section">
        <div className="container">
          <div className="love-letter">
            <h2 className="section-title">My Dearest Love</h2>
            <div className="letter-content">
              <p>
                Every moment with you feels like a beautiful dream that I never
                want to end. You've brought colors into my world that I didn't
                know existed, and warmth into my heart that I never want to
                lose.
              </p>
              <p>
                From the moment we met, I knew there was something special about
                you. Your smile, your laugh, the way you see the world -
                everything about you captivates me. You've become my best
                friend, my confidant, and my greatest adventure.
              </p>
              <p>
                I promise to always cherish you, support your dreams, celebrate
                your victories, and stand by your side through every challenge.
                Together, there's nothing we can't overcome.
              </p>
              <p className="letter-signature">
                I love you more than words can express ❤️
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reasons I Love You Section */}
      <section className="section reasons-bg">
        <div className="container">
          <h2 className="section-title">Reasons I Love You</h2>
          <ReasonsCarousel />
        </div>
      </section>

      {/* Hidden Messages Section */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Tap the Hearts</h2>
          <p className="section-subtitle">
            Click each heart to reveal a special message
          </p>
          <MessageReveal />
        </div>
      </section>

      {/* 1. Message in a Bottle Section */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Messages in Bottles 🍾</h2>
          <p className="section-subtitle">
            Click each bottle to reveal a promise
          </p>
          <MessageInBottle />
        </div>
      </section>

      {/* 2. Constellation of Us Section */}
      <section className="section constellation-bg">
        <div className="container">
          <h2 className="section-title">Our Constellation ✨</h2>
          <p className="section-subtitle">
            Click the stars to relive our special moments
          </p>
          <ConstellationOfUs />
        </div>
      </section>

      {/* 3. Love Fortune Cookies Section */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Love Fortune Cookies 🥠</h2>
          <p className="section-subtitle">
            Crack open each cookie to reveal your fortune
          </p>
          <LoveFortuneCookies />
        </div>
      </section>

      {/* 4. Growing Love Garden Section */}
      <section className="section garden-bg">
        <div className="container">
          <h2 className="section-title">Our Love Garden 🌹</h2>
          <p className="section-subtitle">
            Water each flower to watch it bloom
          </p>
          <GrowingLoveGarden />
        </div>
      </section>

      {/* 5. Heart Lock Bridge Section */}
      <section className="section bridge-bg">
        <div className="container">
          <h2 className="section-title">Bridge of Promises 🔒</h2>
          <p className="section-subtitle">
            Unlock each lock to reveal our promises
          </p>
          <HeartLockBridge />
        </div>
      </section>

      {/* Bucket List Section */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Our Future Adventures</h2>
          <p className="section-subtitle">
            Things I can't wait to experience with you
          </p>
          <BucketList />
        </div>
      </section>

      {/* Final Message Section */}
      <section className="section final-section">
        <div className="container final-content">
          <h2 className="final-title">You Are My Everything</h2>
          <p className="final-subtitle">
            Here's to many more beautiful moments together
          </p>
          <div className="final-emoji">💕</div>
          <p className="final-text">Happy Valentine's Day, My Love</p>
        </div>
      </section>
    </div>
  );
}

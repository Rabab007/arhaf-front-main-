export default function ArhafLogo({ size = 46 }) {
  const iconSize = size * 0.76;

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 30% 30%, #7c3aed 0%, #6a5cff 55%, #4f46e5 100%)',
        boxShadow: '0 10px 28px rgba(109, 76, 255, 0.34)',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block' }}
      >
        {/* center dot */}
        <circle cx="32" cy="32" r="3.6" fill="white" />

        {/* left inner */}
        <path
          d="M28 29.4C26.7 30.2 25.9 31.2 25.6 32.6C25.3 34 25.6 35.4 26.5 36.6"
          stroke="white"
          strokeWidth="3.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* right inner */}
        <path
          d="M36 29.4C37.3 30.2 38.1 31.2 38.4 32.6C38.7 34 38.4 35.4 37.5 36.6"
          stroke="white"
          strokeWidth="3.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* left middle */}
        <path
          d="M23.5 26.2C21.6 27.7 20.3 29.5 19.8 31.8C19.3 34.1 19.8 36.5 21 38.5"
          stroke="white"
          strokeOpacity="0.96"
          strokeWidth="3.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* right middle */}
        <path
          d="M40.5 26.2C42.4 27.7 43.7 29.5 44.2 31.8C44.7 34.1 44.2 36.5 43 38.5"
          stroke="white"
          strokeOpacity="0.96"
          strokeWidth="3.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* left outer */}
        <path
          d="M18.8 22.7C16.1 24.9 14.4 27.6 13.7 30.9C13 34.2 13.8 37.5 15.7 40.4"
          stroke="white"
          strokeOpacity="0.88"
          strokeWidth="3.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* right outer */}
        <path
          d="M45.2 22.7C47.9 24.9 49.6 27.6 50.3 30.9C51 34.2 50.2 37.5 48.3 40.4"
          stroke="white"
          strokeOpacity="0.88"
          strokeWidth="3.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
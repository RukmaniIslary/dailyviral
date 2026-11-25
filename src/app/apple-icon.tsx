import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 40,
          background: 'linear-gradient(135deg, #00aff0 0%, #0090cc 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        <span style={{ color: '#fff', fontSize: 60, fontWeight: 900, letterSpacing: -2, lineHeight: 1 }}>
          DV
        </span>
        <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 22, fontWeight: 700, letterSpacing: 4 }}>
          MMS
        </span>
      </div>
    ),
    { ...size }
  );
}

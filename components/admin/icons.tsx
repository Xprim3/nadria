import type { SVGProps } from "react";

function stroke(props: SVGProps<SVGSVGElement>) {
  return {
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeWidth: 1.5,
    ...props,
  };
}

export function IconDashboard(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...stroke(p)} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 3.75h7.5v7.5h-7.5v-7.5Zm0 10.5h7.5v5.25h-7.5V14.25Zm10.5-10.5h7.5v3.75h-7.5V3.75Zm0 5.25h7.5v10.5h-7.5V9Z"
      />
    </svg>
  );
}

export function IconMenu(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...stroke(p)} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 6.75h15M4.5 12h15m-15 5.25h8.25"
      />
    </svg>
  );
}

export function IconCategories(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...stroke(p)} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25a2.25 2.25 0 0 1-2.25 2.25H15.75A2.25 2.25 0 0 1 13.5 8.25V6ZM3.75 15.75a2.25 2.25 0 0 1 2.25-2.25h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
      />
    </svg>
  );
}

export function IconClock(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...stroke(p)} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  );
}

export function IconNotice(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...stroke(p)} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 14.25V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25h5.5m11.25-2.25v-1.5m-2.25 3.75H15"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5h6M7.5 10.5h6M7.5 13.5h3" />
    </svg>
  );
}

export function IconReview(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...stroke(p)} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.625 9.75h6.75m-6.75 3h4.5m-6.637 7.21c1.126.408 2.338.54 3.512.352 4.053-.648 7.275-4.043 7.838-8.109.688-4.964-3.184-9.203-8.02-9.203-4.837 0-8.709 4.24-8.021 9.203.227 1.639.92 3.123 1.94 4.34.207.247.34.557.321.878-.031.544-.132 1.112-.275 1.647a5.963 5.963 0 0 1-.44 1.057.75.75 0 0 0 .636 1.109 6.483 6.483 0 0 0 2.685-.641Z"
      />
    </svg>
  );
}

export function IconGallery(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...stroke(p)} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.25 2.25m-18-3.75h.008v.008H3.75V15Zm12 0h.008v.008H15.75V15Z"
      />
    </svg>
  );
}

export function IconSettings(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...stroke(p)} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 7.5h15M4.5 12h15M4.5 16.5h15"
      />
    </svg>
  );
}

export function IconExternal(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...stroke(p)} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5M7.5 16.5 21 3m0 0h-4.5M21 3v4.5"
      />
    </svg>
  );
}

export function IconChevronRight(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...stroke(p)} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m8.25 4.5 7.5 7.5-7.5 7.5"
      />
    </svg>
  );
}

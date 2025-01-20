/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      "colors": {
        "vacation": {
          "primary": "#3A47AB",
          "secondary": "#4A56DB",
          "sidebarBackground": "#18202F",
          "subMenuBackground": "#323946",
          "sidebarBorder": "#313131",
          "inputBackground": "#F0F0F7",
          "bodyBackground": "#F0F0F7",
          "customGray": "#646363",
          "sidebarIcon": "#ffffff",
          "inputLabels": "#0B0F18",
          "commonBlack": "#0B0F18",
          "lightPrimary": "#EEF2FF",
          "buttonLink": "#276d97",
          "lightBlue": "#00BCD4",
          "lightBlueHex": "#00BCD4",
          "hoverBlue": "#00BCD4",
          "tableHeader": "#F5F6FA;",
          "coolGray": "#2B3740",
          "background": "#C9CED4",
          "tertiary": "#2B3740",
          "lightGray": "#E5E5E5",
          "font": "#2B3740",
          "gray1": "#DDDDDD",
          "gray2": "#BBBBBB",
          "gray3": "#878793",
          "gray4": "#727272",
          "gray5": "#707070,",
          "gray6": "#3A3952",
          "gray7": "#F9FAFB",
          "gray8": "#7E7E7E",
          "textColor": "#111827",
          "inputBorder": "#D1D5DB",
          "buttonColor": "#3A3952",
          "black": "#000000",
          "green": "#07BF6F",
          "charcoal": "#353940",
          "purple": "#7F43F9",
          "gradientBlue": "#39E4FB",
          "darkPurple": "#312D36",
          "offWhite": "#EBEBED",
          "iconColor": "#6C6CB9",
          "orange": "#EC4E20",
          "blue": "#357FFA",
          "indigo": "#4F46E5",
          "disabled": "#e2e8f0",
          "bgBlue": "#bde4ff",
          "grayText": "#6B7280",
          "tagBg": "#ffffff14",
          "lightYellow": "#FEF3C7",
          "darkYellow": "#92400E",
          "lightGreen": "#D1FAE5",
          "darkGreen": "#065F46",
          "lightRed": "#FEE2E2",
          "darkRed": "#991B1B",
          "lightIndigo": "#EEF2FF",
          "bronze": "#CD7F32",
          "gold": "#ffd700",
          "platinum": "#8F65EE",
          "diamond": "#49D261",
          "silver": "#808080",
          "ggg": "#f3f4f7",
          "pink": "#FFC0CB",
          "teal": "teal",
          "cus_pink": "#AA336A",
          "subMenuPopUpBackground": "#18202F",
          "navyblue": "#313b6b",
          "limedSpruce": "#343e48",
          "viking": "#7fb6da",
          "scooter": "#2fc9cd",
          "lightBlue1": "#747edb",
          "charts": {
            "50": "#DBE2FF",
            "100": "#BDC9FF",
            "200": "#7A93FF",
            "300": "#3358FF",
            "400": "#002CF0",
            "500": "#0020AD",
            "600": "#00198A",
            "700": "#001366",
            "800": "#000D47",
            "900": "#000724"
          }
        }
      },
      "borderColor": {
        "bronze": "#CD7F32"
      },
      "theme": {
        "screens": {
          "ssm": "400px",
          "xsm": "450px",
          "sm": "640px",
          "md": "768px",
          "cu_tab": "769px",
          "lg": "1024px",
          "xl": "1280px"
        }
      }
    }
  },
  plugins: [],
}


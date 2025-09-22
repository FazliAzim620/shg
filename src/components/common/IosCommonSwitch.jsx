import { Switch } from "@mui/material";
import { styled } from "@mui/material/styles";

export const IosCommonSwitch = styled((props) => (
  <Switch
    focusVisibleClassName=".Mui-focusVisible"
    disableRipple
    {...props}
    size="small"
  />
))(({ theme }) => ({
  width: 38,
  height: 23,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    margin: 2.2,
    padding: 0,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        opacity: 1,
        border: 0,
        backgroundColor: "text",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    width: 18,
    height: 18,
    boxSizing: "border-box",
    boxShadow: "none",
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: "#EEF0F7",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

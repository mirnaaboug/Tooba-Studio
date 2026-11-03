/* @ds-bundle: {"format":4,"namespace":"ToobaStudioDesignSystem_55f68e","components":[{"name":"Button","sourcePath":"components/actions/Button.jsx"},{"name":"IconButton","sourcePath":"components/actions/IconButton.jsx"},{"name":"Dots","sourcePath":"components/brand/Dots.jsx"},{"name":"Eyebrow","sourcePath":"components/brand/Eyebrow.jsx"},{"name":"ICON_NAMES","sourcePath":"components/brand/Icon.jsx"},{"name":"Icon","sourcePath":"components/brand/Icon.jsx"},{"name":"Logo","sourcePath":"components/brand/Logo.jsx"},{"name":"PatternSurface","sourcePath":"components/brand/PatternSurface.jsx"},{"name":"Badge","sourcePath":"components/display/Badge.jsx"},{"name":"Card","sourcePath":"components/display/Card.jsx"},{"name":"Tabs","sourcePath":"components/display/Tabs.jsx"},{"name":"Tag","sourcePath":"components/display/Tag.jsx"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"RadioGroup","sourcePath":"components/forms/Radio.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"}],"sourceHashes":{"components/actions/Button.jsx":"708ee7bce429","components/actions/IconButton.jsx":"7f5588102e30","components/brand/Dots.jsx":"c2fc4c7f76f9","components/brand/Eyebrow.jsx":"cf25cfae95e9","components/brand/Icon.jsx":"0f5416ec218a","components/brand/Logo.jsx":"51311c10c69c","components/brand/PatternSurface.jsx":"0337d2334ae7","components/display/Badge.jsx":"863be1f35b79","components/display/Card.jsx":"88d6187dd6ce","components/display/Tabs.jsx":"926146df25ca","components/display/Tag.jsx":"85061d57c3ed","components/feedback/Dialog.jsx":"0332cfc724bf","components/feedback/Toast.jsx":"6538fe527e33","components/feedback/Tooltip.jsx":"5ca5af7fd8fb","components/forms/Checkbox.jsx":"c9b5b4c1d978","components/forms/Input.jsx":"1a7622886673","components/forms/Radio.jsx":"264225a3297d","components/forms/Select.jsx":"950f54230562","components/forms/Switch.jsx":"f2bd2cddc963","ui_kits/brand_applications/BusinessCard.jsx":"61a0be73f328","ui_kits/brand_applications/InstagramPost.jsx":"36b3bf9dad5e","ui_kits/brand_applications/Story.jsx":"858ccb60b55c"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.ToobaStudioDesignSystem_55f68e = window.ToobaStudioDesignSystem_55f68e || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/actions/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
const SIZES = {
  sm: {
    h: 36,
    px: 16,
    fs: 11
  },
  md: {
    h: 44,
    px: 22,
    fs: 12
  },
  lg: {
    h: 52,
    px: 28,
    fs: 13
  }
};
function Button({
  children,
  variant = 'primary',
  size = 'md',
  tone = 'light',
  disabled = false,
  fullWidth = false,
  iconStart,
  iconEnd,
  onClick,
  type = 'button',
  style,
  ...rest
}) {
  const [hov, setHov] = useState(false);
  const [down, setDown] = useState(false);
  const s = SIZES[size] || SIZES.md;
  const dark = tone === 'dark';
  const fg = dark ? 'var(--oat)' : 'var(--nile)';
  const V = {
    primary: {
      bg: hov ? 'var(--apricot-press)' : 'var(--apricot)',
      fg: 'var(--nile)',
      bd: 'transparent'
    },
    secondary: dark ? {
      bg: hov ? 'var(--oat-step)' : 'var(--oat)',
      fg: 'var(--nile)',
      bd: 'transparent'
    } : {
      bg: hov ? 'var(--nile-step)' : 'var(--nile)',
      fg: 'var(--oat)',
      bd: 'transparent'
    },
    outline: {
      bg: hov ? dark ? 'rgba(241,231,214,.08)' : 'rgba(18,63,59,.06)' : 'transparent',
      fg,
      bd: fg
    },
    ghost: {
      bg: hov ? dark ? 'rgba(241,231,214,.08)' : 'rgba(18,63,59,.06)' : 'transparent',
      fg,
      bd: 'transparent'
    }
  }[variant] || {};
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHov(true),
    onMouseLeave: () => {
      setHov(false);
      setDown(false);
    },
    onMouseDown: () => setDown(true),
    onMouseUp: () => setDown(false)
  }, rest, {
    style: {
      display: fullWidth ? 'flex' : 'inline-flex',
      width: fullWidth ? '100%' : undefined,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      height: s.h,
      padding: '0 ' + s.px + 'px',
      font: '500 ' + s.fs + 'px/1 var(--font-sans)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      background: V.bg,
      color: V.fg,
      border: '1.5px solid ' + V.bd,
      borderRadius: 'var(--radius-cell)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? .4 : 1,
      transform: down && !disabled ? 'translateY(1px)' : 'none',
      transition: 'background var(--dur-fast) var(--ease-standard),transform var(--dur-fast)',
      whiteSpace: 'nowrap',
      ...style
    }
  }), iconStart, children, iconEnd);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/Button.jsx", error: String((e && e.message) || e) }); }

// components/brand/Dots.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Dots({
  size = 6,
  gap,
  color = 'var(--apricot)',
  vertical = false,
  style,
  ...rest
}) {
  const g = gap ?? size;
  const d = {
    width: size,
    height: size,
    borderRadius: '50%',
    background: color,
    flex: 'none'
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    "aria-hidden": "true"
  }, rest, {
    style: {
      display: 'inline-flex',
      flexDirection: vertical ? 'column' : 'row',
      gap: g,
      alignItems: 'center',
      verticalAlign: 'middle',
      ...style
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: d
  }), /*#__PURE__*/React.createElement("span", {
    style: d
  }));
}
Object.assign(__ds_scope, { Dots });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Dots.jsx", error: String((e && e.message) || e) }); }

// components/brand/Eyebrow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Eyebrow({
  children,
  tone = 'light',
  accent = false,
  as: Tag = 'div',
  style,
  ...rest
}) {
  const color = accent ? 'var(--apricot)' : tone === 'dark' ? 'var(--oat)' : 'var(--nile)';
  return /*#__PURE__*/React.createElement(Tag, _extends({}, rest, {
    style: {
      font: 'var(--type-eyebrow)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color,
      margin: 0,
      ...style
    }
  }), children);
}
Object.assign(__ds_scope, { Eyebrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Eyebrow.jsx", error: String((e && e.message) || e) }); }

// components/brand/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const ICON_NAMES = ['strategy', 'naming', 'identity', 'typography', 'color', 'brand-book', 'packaging', 'social', 'motion', 'web', 'photography', 'rebrand', 'speed', 'chat', 'location', 'proposal'];
function Icon({
  name = 'strategy',
  size = 24,
  tone = 'light',
  title,
  style,
  ...rest
}) {
  const c = tone === 'dark' ? 'oat' : 'nile';
  const s = [16, 24, 32, 48].includes(size) ? size : 24;
  return /*#__PURE__*/React.createElement("span", _extends({
    role: title ? 'img' : undefined,
    "aria-label": title,
    "aria-hidden": title ? undefined : true
  }, rest, {
    className: 'tb-asset tb-icon-' + name + '-' + c,
    style: {
      display: 'inline-block',
      width: s,
      height: s,
      flex: 'none',
      ...style
    }
  }));
}
Object.assign(__ds_scope, { ICON_NAMES, Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Icon.jsx", error: String((e && e.message) || e) }); }

// components/actions/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
function IconButton({
  icon,
  label,
  size = 44,
  variant = 'outline',
  tone = 'light',
  disabled = false,
  onClick,
  style,
  ...rest
}) {
  const [hov, setHov] = useState(false);
  const dark = tone === 'dark';
  const fg = dark ? 'var(--oat)' : 'var(--nile)';
  const bg = variant === 'solid' ? dark ? 'var(--oat)' : 'var(--nile)' : hov ? dark ? 'rgba(241,231,214,.08)' : 'rgba(18,63,59,.06)' : 'transparent';
  const iconTone = variant === 'solid' ? dark ? 'light' : 'dark' : tone;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": label,
    title: label,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHov(true),
    onMouseLeave: () => setHov(false)
  }, rest, {
    style: {
      width: size,
      height: size,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 0,
      background: bg,
      border: variant === 'ghost' ? '1.5px solid transparent' : '1.5px solid ' + fg,
      borderRadius: 'var(--radius-cell)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? .4 : 1,
      transition: 'background var(--dur-fast)',
      ...style
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: size >= 52 ? 32 : 24,
    tone: iconTone
  }));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/brand/Logo.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const RATIO = {
  horizontal: 644.24 / 190,
  tagline: 644.24 / 272.8,
  stacked: 356.24 / 440.8,
  mark: 1,
  wordmark: 356.24 / 150.8
};
function Logo({
  variant = 'horizontal',
  color = 'nile',
  height,
  width,
  style,
  title = 'Tooba Studio',
  ...rest
}) {
  let key;
  if (variant === 'mark') {
    key = {
      nile: 'mark-nile',
      'oat-on-nile': 'mark-oat-on-nile',
      oat: 'mark-oat-transparent',
      'one-color': 'mark-onecolor-nile',
      white: 'mark-onecolor-white',
      small: 'mark-smallsizes-nile'
    }[color] || 'mark-nile';
  } else if (variant === 'wordmark') {
    key = 'wordmark-nile';
  } else {
    key = 'lockup-' + variant + '-' + ({
      nile: 'nile',
      'oat-on-nile': 'oat-on-nile',
      oat: 'oat-transparent'
    }[color] || 'nile');
  }
  const r = RATIO[variant] || 1;
  const h = height ?? (width ? width / r : variant === 'mark' ? 48 : 56);
  const w = width ?? h * r;
  return /*#__PURE__*/React.createElement("span", _extends({
    role: "img",
    "aria-label": title
  }, rest, {
    className: 'tb-asset tb-logo-' + key,
    style: {
      display: 'inline-block',
      width: w,
      height: h,
      flex: 'none',
      ...style
    }
  }));
}
Object.assign(__ds_scope, { Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Logo.jsx", error: String((e && e.message) || e) }); }

// components/brand/PatternSurface.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function PatternSurface({
  children,
  tileSize = 240,
  padding = 'var(--space-7)',
  radius = 0,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    className: "tb-pattern",
    style: {
      backgroundSize: tileSize + 'px ' + tileSize + 'px',
      color: 'var(--oat)',
      padding,
      borderRadius: radius,
      ...style
    }
  }), children);
}
Object.assign(__ds_scope, { PatternSurface });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/PatternSurface.jsx", error: String((e && e.message) || e) }); }

// components/display/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const V = {
  nile: {
    bg: 'var(--nile)',
    fg: 'var(--oat)'
  },
  oat: {
    bg: 'var(--oat)',
    fg: 'var(--nile)'
  },
  apricot: {
    bg: 'var(--apricot)',
    fg: 'var(--nile)'
  },
  papyrus: {
    bg: 'var(--papyrus)',
    fg: 'var(--nile)'
  }
};
function Badge({
  children,
  color = 'nile',
  dot = false,
  style,
  ...rest
}) {
  const v = V[color] || V.nile;
  return /*#__PURE__*/React.createElement("span", _extends({}, rest, {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      height: 24,
      padding: '0 10px',
      borderRadius: 'var(--radius-sm)',
      background: v.bg,
      color: v.fg,
      font: '500 10px/1 var(--font-sans)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
      ...style
    }
  }), dot && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      gap: 3
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 4,
      height: 4,
      borderRadius: '50%',
      background: color === 'apricot' ? 'var(--nile)' : 'var(--apricot)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 4,
      height: 4,
      borderRadius: '50%',
      background: color === 'apricot' ? 'var(--nile)' : 'var(--apricot)'
    }
  })), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Badge.jsx", error: String((e && e.message) || e) }); }

// components/display/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
const SURF = {
  oat: {
    bg: 'var(--oat)',
    fg: 'var(--nile)',
    bd: 'transparent'
  },
  white: {
    bg: 'var(--white)',
    fg: 'var(--nile)',
    bd: 'var(--line-on-light)'
  },
  nile: {
    bg: 'var(--nile)',
    fg: 'var(--oat)',
    bd: 'transparent'
  },
  papyrus: {
    bg: 'var(--papyrus)',
    fg: 'var(--nile)',
    bd: 'transparent'
  },
  outline: {
    bg: 'transparent',
    fg: 'var(--nile)',
    bd: 'var(--nile)'
  }
};
function Card({
  children,
  surface = 'oat',
  padding = 28,
  interactive = false,
  onClick,
  style,
  ...rest
}) {
  const [h, setH] = useState(false);
  const s = SURF[surface] || SURF.oat;
  return /*#__PURE__*/React.createElement("div", _extends({
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false)
  }, rest, {
    style: {
      background: s.bg,
      color: s.fg,
      border: '1.5px solid ' + (interactive && h && surface !== 'nile' ? 'var(--nile)' : s.bd),
      borderRadius: 'var(--radius-cell)',
      padding,
      cursor: interactive ? 'pointer' : undefined,
      transition: 'border-color var(--dur-fast),transform var(--dur-base) var(--ease-standard)',
      transform: interactive && h ? 'translateY(-2px)' : 'none',
      ...style
    }
  }), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Card.jsx", error: String((e && e.message) || e) }); }

// components/display/Tabs.jsx
try { (() => {
function Tabs({
  items = [],
  value,
  defaultValue,
  onChange,
  tone = 'light',
  style
}) {
  const [v, setV] = React.useState(defaultValue ?? (items[0] && (items[0].value ?? items[0])));
  const cur = value ?? v;
  const fg = tone === 'dark' ? 'var(--oat)' : 'var(--nile)';
  const line = tone === 'dark' ? 'var(--line-on-dark)' : 'var(--line-on-light)';
  return /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    style: {
      display: 'flex',
      gap: 32,
      borderBottom: '1px solid ' + line,
      ...style
    }
  }, items.map(it => {
    const val = it.value ?? it;
    const lab = it.label ?? it;
    const on = val === cur;
    return /*#__PURE__*/React.createElement("button", {
      key: val,
      role: "tab",
      "aria-selected": on,
      onClick: () => {
        setV(val);
        onChange && onChange(val);
      },
      style: {
        position: 'relative',
        background: 'none',
        border: 0,
        padding: '0 0 14px',
        marginBottom: -1,
        cursor: 'pointer',
        color: fg,
        opacity: on ? 1 : .6,
        font: '500 12px/1 var(--font-sans)',
        letterSpacing: 'var(--tracking-label)',
        textTransform: 'uppercase',
        borderBottom: '2px solid ' + (on ? fg : 'transparent'),
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, on && /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        gap: 3
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 4,
        height: 4,
        borderRadius: '50%',
        background: 'var(--apricot)'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        width: 4,
        height: 4,
        borderRadius: '50%',
        background: 'var(--apricot)'
      }
    })), lab);
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/display/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
function Tag({
  children,
  selected = false,
  onClick,
  onRemove,
  tone = 'light',
  style,
  ...rest
}) {
  const [h, setH] = useState(false);
  const dark = tone === 'dark';
  const fg = dark ? 'var(--oat)' : 'var(--nile)';
  return /*#__PURE__*/React.createElement("span", _extends({
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false)
  }, rest, {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      height: 32,
      padding: '0 14px',
      borderRadius: 'var(--radius-cell)',
      border: '1.5px solid ' + fg,
      background: selected ? fg : h && onClick ? dark ? 'rgba(241,231,214,.08)' : 'rgba(18,63,59,.06)' : 'transparent',
      color: selected ? dark ? 'var(--nile)' : 'var(--oat)' : fg,
      font: '400 14px/1 var(--font-sans)',
      cursor: onClick ? 'pointer' : undefined,
      userSelect: 'none',
      transition: 'background var(--dur-fast)',
      ...style
    }
  }), children, onRemove && /*#__PURE__*/React.createElement("span", {
    role: "button",
    "aria-label": "Remove",
    onClick: e => {
      e.stopPropagation();
      onRemove();
    },
    style: {
      marginLeft: 2,
      fontSize: 16,
      lineHeight: 1,
      cursor: 'pointer'
    }
  }, "\xD7"));
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Tag.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Dialog.jsx
try { (() => {
function Dialog({
  open,
  onClose,
  eyebrow,
  title,
  children,
  actions,
  width = 520
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(18,63,59,.55)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      zIndex: 1000
    }
  }, /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    onClick: e => e.stopPropagation(),
    style: {
      width: '100%',
      maxWidth: width,
      background: 'var(--oat)',
      color: 'var(--nile)',
      borderRadius: 'var(--radius-cell)',
      padding: '36px 36px 28px',
      boxShadow: 'var(--shadow-overlay)',
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, eyebrow && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-eyebrow)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase'
    }
  }, eyebrow), title && /*#__PURE__*/React.createElement("h2", {
    style: {
      font: '400 32px/1.1 var(--font-serif)',
      letterSpacing: 'var(--tracking-headline)',
      margin: 0
    }
  }, title), children && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-body)'
    }
  }, children), actions && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      justifyContent: 'flex-end',
      marginTop: 8
    }
  }, actions)));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
function Toast({
  children,
  title,
  onClose,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    role: "status",
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 14,
      minWidth: 280,
      maxWidth: 420,
      background: 'var(--nile)',
      color: 'var(--oat)',
      borderRadius: 'var(--radius-cell)',
      padding: '16px 18px',
      boxShadow: 'var(--shadow-overlay)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      gap: 4,
      marginTop: 7,
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: 'var(--apricot)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: 'var(--apricot)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, title && /*#__PURE__*/React.createElement("div", {
    style: {
      font: '500 15px/1.35 var(--font-sans)'
    }
  }, title), children && /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 14px/1.45 var(--font-sans)',
      color: 'var(--text-muted-on-dark)'
    }
  }, children)), onClose && /*#__PURE__*/React.createElement("button", {
    "aria-label": "Dismiss",
    onClick: onClose,
    style: {
      background: 'none',
      border: 0,
      color: 'var(--oat)',
      fontSize: 18,
      lineHeight: 1,
      cursor: 'pointer',
      padding: 0
    }
  }, "\xD7"));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
const {
  useState
} = React;
function Tooltip({
  content,
  children,
  placement = 'top'
}) {
  const [o, setO] = useState(false);
  const pos = placement === 'bottom' ? {
    top: 'calc(100% + 8px)'
  } : {
    bottom: 'calc(100% + 8px)'
  };
  return /*#__PURE__*/React.createElement("span", {
    onMouseEnter: () => setO(true),
    onMouseLeave: () => setO(false),
    onFocus: () => setO(true),
    onBlur: () => setO(false),
    style: {
      position: 'relative',
      display: 'inline-flex'
    }
  }, children, o && /*#__PURE__*/React.createElement("span", {
    role: "tooltip",
    style: {
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
      ...pos,
      background: 'var(--nile)',
      color: 'var(--oat)',
      font: '400 13px/1.3 var(--font-sans)',
      padding: '8px 12px',
      borderRadius: 'var(--radius-sm)',
      whiteSpace: 'nowrap',
      pointerEvents: 'none',
      zIndex: 50
    }
  }, content));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Checkbox({
  label,
  checked,
  defaultChecked,
  onChange,
  disabled,
  tone = 'light',
  style,
  ...rest
}) {
  const [c, setC] = React.useState(defaultChecked || false);
  const on = checked ?? c;
  const fg = tone === 'dark' ? 'var(--oat)' : 'var(--nile)';
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? .45 : 1,
      font: 'var(--type-body)',
      color: fg,
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox",
    checked: on,
    disabled: disabled,
    onChange: e => {
      setC(e.target.checked);
      onChange && onChange(e);
    }
  }, rest, {
    style: {
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 22,
      height: 22,
      flex: 'none',
      borderRadius: 'var(--radius-sm)',
      border: '1.5px solid ' + fg,
      background: on ? fg : 'transparent',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 3,
      transition: 'background var(--dur-fast)'
    }
  }, on && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 5,
      height: 5,
      borderRadius: '50%',
      background: 'var(--apricot)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 5,
      height: 5,
      borderRadius: '50%',
      background: 'var(--apricot)'
    }
  }))), label);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
const labelStyle = {
  font: 'var(--type-eyebrow)',
  letterSpacing: 'var(--tracking-label)',
  textTransform: 'uppercase',
  color: 'var(--nile)'
};
function Input({
  label,
  hint,
  error,
  multiline = false,
  rows = 4,
  id,
  value,
  defaultValue,
  onChange,
  placeholder,
  disabled,
  type = 'text',
  style,
  ...rest
}) {
  const [f, setF] = useState(false);
  const Tag = multiline ? 'textarea' : 'input';
  const iid = id || (label ? 'tb-' + String(label).toLowerCase().replace(/\W+/g, '-') : undefined);
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: iid,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: labelStyle
  }, label), /*#__PURE__*/React.createElement(Tag, _extends({
    id: iid,
    type: multiline ? undefined : type,
    rows: multiline ? rows : undefined,
    value: value,
    defaultValue: defaultValue,
    onChange: onChange,
    placeholder: placeholder,
    disabled: disabled,
    onFocus: () => setF(true),
    onBlur: () => setF(false)
  }, rest, {
    style: {
      font: 'var(--type-body)',
      color: 'var(--nile)',
      background: 'var(--white)',
      border: '1.5px solid ' + (error ? 'var(--apricot)' : f ? 'var(--nile)' : 'var(--line-on-light)'),
      borderRadius: 'var(--radius-cell)',
      padding: multiline ? '12px 14px' : '0 14px',
      height: multiline ? undefined : 48,
      outline: 'none',
      resize: multiline ? 'vertical' : undefined,
      opacity: disabled ? .5 : 1,
      transition: 'border-color var(--dur-fast)'
    }
  })), (error || hint) && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-caption)',
      color: error ? 'var(--nile)' : 'var(--text-muted-on-light)',
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, error && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: 'var(--apricot)'
    }
  }), error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Radio({
  label,
  name,
  value,
  checked,
  defaultChecked,
  onChange,
  disabled,
  tone = 'light',
  style,
  ...rest
}) {
  const fg = tone === 'dark' ? 'var(--oat)' : 'var(--nile)';
  const [c, setC] = React.useState(defaultChecked || false);
  const on = checked ?? c;
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? .45 : 1,
      font: 'var(--type-body)',
      color: fg,
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "radio",
    name: name,
    value: value,
    checked: checked,
    defaultChecked: defaultChecked,
    disabled: disabled,
    onChange: e => {
      setC(e.target.checked);
      onChange && onChange(e);
    }
  }, rest, {
    style: {
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 22,
      height: 22,
      flex: 'none',
      borderRadius: '50%',
      border: '1.5px solid ' + fg,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, on && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: '50%',
      background: 'var(--apricot)'
    }
  })), label);
}
function RadioGroup({
  name,
  options = [],
  value,
  defaultValue,
  onChange,
  tone,
  direction = 'column',
  style
}) {
  const [v, setV] = React.useState(defaultValue);
  const cur = value ?? v;
  return /*#__PURE__*/React.createElement("div", {
    role: "radiogroup",
    style: {
      display: 'flex',
      flexDirection: direction,
      gap: direction === 'row' ? 24 : 14,
      ...style
    }
  }, options.map(o => {
    const val = typeof o === 'string' ? o : o.value;
    const lab = typeof o === 'string' ? o : o.label;
    return /*#__PURE__*/React.createElement(Radio, {
      key: val,
      name: name,
      value: val,
      label: lab,
      tone: tone,
      checked: cur === val,
      onChange: () => {
        setV(val);
        onChange && onChange(val);
      }
    });
  }));
}
Object.assign(__ds_scope, { Radio, RadioGroup });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const labelStyle = {
  font: 'var(--type-eyebrow)',
  letterSpacing: 'var(--tracking-label)',
  textTransform: 'uppercase',
  color: 'var(--nile)'
};
function Select({
  label,
  options = [],
  value,
  defaultValue,
  onChange,
  placeholder,
  disabled,
  id,
  style,
  ...rest
}) {
  const iid = id || (label ? 'tb-' + String(label).toLowerCase().replace(/\W+/g, '-') : undefined);
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: iid,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: labelStyle
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'block'
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    id: iid,
    value: value,
    defaultValue: defaultValue,
    onChange: onChange,
    disabled: disabled
  }, rest, {
    style: {
      appearance: 'none',
      WebkitAppearance: 'none',
      width: '100%',
      height: 48,
      font: 'var(--type-body)',
      color: 'var(--nile)',
      background: 'var(--white)',
      border: '1.5px solid var(--line-on-light)',
      borderRadius: 'var(--radius-cell)',
      padding: '0 44px 0 14px',
      outline: 'none',
      cursor: 'pointer',
      opacity: disabled ? .5 : 1
    }
  }), placeholder && /*#__PURE__*/React.createElement("option", {
    value: ""
  }, placeholder), options.map(o => typeof o === 'string' ? /*#__PURE__*/React.createElement("option", {
    key: o,
    value: o
  }, o) : /*#__PURE__*/React.createElement("option", {
    key: o.value,
    value: o.value
  }, o.label))), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      right: 16,
      top: '50%',
      display: 'flex',
      gap: 4,
      transform: 'translateY(-50%)',
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 5,
      height: 5,
      borderRadius: '50%',
      background: 'var(--apricot)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 5,
      height: 5,
      borderRadius: '50%',
      background: 'var(--apricot)'
    }
  }))));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function Switch({
  label,
  checked,
  defaultChecked,
  onChange,
  disabled,
  tone = 'light',
  style
}) {
  const [c, setC] = React.useState(defaultChecked || false);
  const on = checked ?? c;
  const fg = tone === 'dark' ? 'var(--oat)' : 'var(--nile)';
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? .45 : 1,
      font: 'var(--type-body)',
      color: fg,
      ...style
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    role: "switch",
    "aria-checked": on,
    disabled: disabled,
    onClick: () => {
      setC(!on);
      onChange && onChange(!on);
    },
    style: {
      width: 44,
      height: 26,
      padding: 3,
      flex: 'none',
      borderRadius: 'var(--radius-cell)',
      border: '1.5px solid ' + fg,
      background: on ? fg : 'transparent',
      display: 'flex',
      justifyContent: on ? 'flex-end' : 'flex-start',
      alignItems: 'center',
      cursor: 'inherit',
      transition: 'background var(--dur-base)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 16,
      height: 16,
      borderRadius: '50%',
      background: on ? 'var(--apricot)' : fg,
      transition: 'all var(--dur-base) var(--ease-standard)'
    }
  })), label);
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// ui_kits/brand_applications/BusinessCard.jsx
try { (() => {
(() => {
  const {
    Logo,
    Dots
  } = window.ToobaStudioDesignSystem_55f68e;
  // 85 × 55 mm at 10px/mm
  function BusinessCard({
    side = 'front',
    name = '[NAME]',
    role = 'Founder',
    email = '[EMAIL]',
    phone = '[PHONE]'
  }) {
    const base = {
      width: 850,
      height: 550,
      borderRadius: 16,
      boxSizing: 'border-box',
      overflow: 'hidden'
    };
    if (side === 'front') return /*#__PURE__*/React.createElement("div", {
      style: {
        ...base,
        background: 'var(--nile)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(Logo, {
      variant: "mark",
      color: "oat",
      height: 200
    }));
    return /*#__PURE__*/React.createElement("div", {
      style: {
        ...base,
        background: 'var(--oat)',
        color: 'var(--nile)',
        padding: 72,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: '400 44px/1.1 var(--font-serif)',
        letterSpacing: 'var(--tracking-wordmark)'
      }
    }, "TOOBA", /*#__PURE__*/React.createElement("br", null), "STUDIO"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        font: '500 26px/1 var(--font-sans)'
      }
    }, /*#__PURE__*/React.createElement(Dots, {
      size: 8
    }), name, " \xB7 ", role), /*#__PURE__*/React.createElement("div", {
      style: {
        font: '400 24px/1.4 var(--font-sans)'
      }
    }, email, " \xB7 ", phone)));
  }
  window.BusinessCard = BusinessCard;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/brand_applications/BusinessCard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/brand_applications/InstagramPost.jsx
try { (() => {
(() => {
  const {
    Logo,
    Eyebrow,
    Dots
  } = window.ToobaStudioDesignSystem_55f68e;
  function InstagramPost({
    index = 1,
    total = 6
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        width: 1080,
        height: 1350,
        background: 'var(--oat)',
        color: 'var(--nile)',
        padding: 96,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxSizing: 'border-box'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: '500 28px/1 var(--font-sans)',
        letterSpacing: 'var(--tracking-label)'
      }
    }, String(index).padStart(2, '0'), " / ", String(total).padStart(2, '0')), /*#__PURE__*/React.createElement(Logo, {
      variant: "mark",
      height: 96
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 48
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: '400 132px/1.05 var(--font-serif)',
        letterSpacing: '-.01em'
      }
    }, "Every brand", /*#__PURE__*/React.createElement("br", null), "starts with a brick."), /*#__PURE__*/React.createElement("div", {
      style: {
        font: '300 44px/1.3 var(--font-sans)'
      }
    }, "Strategy to identity in days, not months.")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 20
      }
    }, /*#__PURE__*/React.createElement(Dots, {
      size: 16
    }), /*#__PURE__*/React.createElement(Eyebrow, {
      style: {
        fontSize: 24
      }
    }, "Tooba Studio \xB7 Cairo")));
  }
  window.InstagramPost = InstagramPost;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/brand_applications/InstagramPost.jsx", error: String((e && e.message) || e) }); }

// ui_kits/brand_applications/Story.jsx
try { (() => {
(() => {
  const {
    Logo,
    Eyebrow,
    PatternSurface
  } = window.ToobaStudioDesignSystem_55f68e;
  function Story() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        width: 1080,
        height: 1920,
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box'
      }
    }, /*#__PURE__*/React.createElement(PatternSurface, {
      tileSize: 480,
      padding: 0,
      style: {
        height: 760,
        flex: 'none'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        background: 'var(--nile)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 96
      }
    }, /*#__PURE__*/React.createElement(Logo, {
      variant: "stacked",
      color: "oat",
      height: 520
    }), /*#__PURE__*/React.createElement(Eyebrow, {
      tone: "dark",
      style: {
        fontSize: 30,
        textAlign: 'center',
        lineHeight: 1.6
      }
    }, "Every brand starts", /*#__PURE__*/React.createElement("br", null), "with a brick")));
  }
  window.Story = Story;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/brand_applications/Story.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Dots = __ds_scope.Dots;

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

__ds_ns.ICON_NAMES = __ds_scope.ICON_NAMES;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.PatternSurface = __ds_scope.PatternSurface;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.RadioGroup = __ds_scope.RadioGroup;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

})();

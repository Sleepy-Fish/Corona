const _clampAngle = (angle) => {
  if (angle > 360) return _clampAngle(angle - 360);
  if (angle < 0) return _clampAngle(angle + 360);
  return angle;
};

export default {
  clampAngle: _clampAngle
};

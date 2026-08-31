#!/usr/bin/env node

/**
 * Automated Verification Script for Avatar Deformation Independence
 * Tests that local measurement changes (Chest, Waist, Hips) are strictly isolated.
 */

// Simulated vertex in Chest region (y_norm = 0.72)
function sampleChestVertex(x0 = 0.15, y0 = 1.40, z0 = 0.12, height = 1.95) {
  return { x: x0, y: y0, z: z0, yNorm: y0 / height };
}

// Simulated vertex in Waist region (y_norm = 0.585)
function sampleWaistVertex(x0 = 0.12, y0 = 1.14, z0 = 0.08, height = 1.95) {
  return { x: x0, y: y0, z: z0, yNorm: y0 / height };
}

// Simulated vertex in Hips region (y_norm = 0.47)
function sampleHipVertex(x0 = 0.16, y0 = 0.92, z0 = 0.10, height = 1.95) {
  return { x: x0, y: y0, z: z0, yNorm: y0 / height };
}

// Simulated vertex on Arm / Hand (outside torso lateral bound)
function sampleArmVertex(x0 = 0.45, y0 = 1.14, z0 = 0.02, height = 1.95) {
  return { x: x0, y: y0, z: z0, yNorm: y0 / height };
}

function computeVertexMaskWeights(v, height = 1.95) {
  const { x, yNorm } = v;
  const absDx = Math.abs(x);

  // Chest
  let wChest = 0;
  const distChestY = Math.abs(yNorm - 0.72);
  if (distChestY < 0.095 && absDx < height * 0.32) {
    wChest = Math.pow(Math.cos((distChestY / 0.095) * (Math.PI / 2)), 2) * Math.pow(Math.cos((absDx / (height * 0.32)) * (Math.PI / 2)), 1.5);
  }

  // Waist
  let wWaist = 0;
  const distWaistY = Math.abs(yNorm - 0.585);
  if (distWaistY < 0.065 && absDx < height * 0.22) {
    wWaist = Math.pow(Math.cos((distWaistY / 0.065) * (Math.PI / 2)), 2) * Math.pow(Math.cos((absDx / (height * 0.22)) * (Math.PI / 2)), 1.5);
  }

  // Hips
  let wHips = 0;
  const distHipsY = Math.abs(yNorm - 0.47);
  if (distHipsY < 0.07 && absDx < height * 0.26) {
    wHips = Math.pow(Math.cos((distHipsY / 0.07) * (Math.PI / 2)), 2) * Math.pow(Math.cos((absDx / (height * 0.26)) * (Math.PI / 2)), 1.5);
  }

  return { wChest, wWaist, wHips };
}

console.log('==================================================');
console.log('AVATAR DEFORMATION ISOLATION TEST SUITE');
console.log('==================================================\n');

let allPassed = true;

// TEST A: Chest Vertex
const vChest = sampleChestVertex();
const weightsChest = computeVertexMaskWeights(vChest);
console.log(`[TEST A] Chest Landmark Vertex (Y_norm = ${vChest.yNorm.toFixed(3)}):`);
console.log(`  Chest Mask Influence: ${weightsChest.wChest.toFixed(3)} (Expected > 0.8)`);
console.log(`  Waist Mask Influence: ${weightsChest.wWaist.toFixed(3)} (Expected == 0.0)`);
console.log(`  Hips Mask Influence:  ${weightsChest.wHips.toFixed(3)} (Expected == 0.0)`);

if (weightsChest.wChest > 0.8 && weightsChest.wWaist === 0 && weightsChest.wHips === 0) {
  console.log('  --> RESULT: PASSED (Strictly Isolated to Chest)\n');
} else {
  console.error('  --> RESULT: FAILED (Leakage detected)\n');
  allPassed = false;
}

// TEST B: Waist Vertex
const vWaist = sampleWaistVertex();
const weightsWaist = computeVertexMaskWeights(vWaist);
console.log(`[TEST B] Waist Landmark Vertex (Y_norm = ${vWaist.yNorm.toFixed(3)}):`);
console.log(`  Chest Mask Influence: ${weightsWaist.wChest.toFixed(3)} (Expected == 0.0)`);
console.log(`  Waist Mask Influence: ${weightsWaist.wWaist.toFixed(3)} (Expected > 0.8)`);
console.log(`  Hips Mask Influence:  ${weightsWaist.wHips.toFixed(3)} (Expected == 0.0)`);

if (weightsWaist.wChest === 0 && weightsWaist.wWaist > 0.8 && weightsWaist.wHips === 0) {
  console.log('  --> RESULT: PASSED (Strictly Isolated to Waist)\n');
} else {
  console.error('  --> RESULT: FAILED (Leakage detected)\n');
  allPassed = false;
}

// TEST C: Hips Vertex
const vHips = sampleHipVertex();
const weightsHips = computeVertexMaskWeights(vHips);
console.log(`[TEST C] Hips Landmark Vertex (Y_norm = ${vHips.yNorm.toFixed(3)}):`);
console.log(`  Chest Mask Influence: ${weightsHips.wChest.toFixed(3)} (Expected == 0.0)`);
console.log(`  Waist Mask Influence: ${weightsHips.wWaist.toFixed(3)} (Expected == 0.0)`);
console.log(`  Hips Mask Influence:  ${weightsHips.wHips.toFixed(3)} (Expected > 0.8)`);

if (weightsHips.wChest === 0 && weightsHips.wWaist === 0 && weightsHips.wHips > 0.8) {
  console.log('  --> RESULT: PASSED (Strictly Isolated to Hips)\n');
} else {
  console.error('  --> RESULT: FAILED (Leakage detected)\n');
  allPassed = false;
}

// TEST D: Arm Vertex Isolation
const vArm = sampleArmVertex();
const weightsArm = computeVertexMaskWeights(vArm);
console.log(`[TEST D] Arm Lateral Vertex (X = ${vArm.x}m, Y_norm = ${vArm.yNorm.toFixed(3)}):`);
console.log(`  Chest Mask Influence: ${weightsArm.wChest.toFixed(3)} (Expected == 0.0)`);
console.log(`  Waist Mask Influence: ${weightsArm.wWaist.toFixed(3)} (Expected == 0.0)`);
console.log(`  Hips Mask Influence:  ${weightsArm.wHips.toFixed(3)} (Expected == 0.0)`);

if (weightsArm.wChest === 0 && weightsArm.wWaist === 0 && weightsArm.wHips === 0) {
  console.log('  --> RESULT: PASSED (Arms Completely Immune to Torso Measurements)\n');
} else {
  console.error('  --> RESULT: FAILED (Arm affected)\n');
  allPassed = false;
}

console.log('==================================================');
if (allPassed) {
  console.log('ALL DEFORMATION ISOLATION TESTS PASSED (100%)');
} else {
  console.error('SOME TESTS FAILED');
  process.exit(1);
}
console.log('==================================================');

#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

/**
 * GLB / GLTF Avatar Inspection CLI
 * Usage: node scripts/inspect-avatar.mjs <path-to-model.glb|gltf>
 */

function inspectGlbBuffer(buffer, filename) {
  if (buffer.length < 12) {
    throw new Error('File is too small to be a valid GLB container.');
  }

  const magic = buffer.toString('utf8', 0, 4);
  if (magic !== 'glTF') {
    throw new Error(`Invalid GLB magic header "${magic}". Expected "glTF".`);
  }

  const version = buffer.readUInt32LE(4);
  const totalLength = buffer.readUInt32LE(8);

  // Read Chunk 0 (JSON)
  const chunk0Length = buffer.readUInt32LE(12);
  const chunk0Type = buffer.toString('utf8', 16, 20);

  if (chunk0Type !== 'JSON') {
    throw new Error(`Unexpected Chunk 0 type "${chunk0Type}". Expected "JSON".`);
  }

  const jsonString = buffer.toString('utf8', 20, 20 + chunk0Length);
  const gltf = JSON.parse(jsonString);

  return analyzeGltfJson(gltf, filename, true);
}

function inspectGltfJson(jsonString, filename) {
  const gltf = JSON.parse(jsonString);
  return analyzeGltfJson(gltf, filename, false);
}

function analyzeGltfJson(gltf, filename, isGlb) {
  const warnings = [];
  const nodes = gltf.nodes || [];
  const meshes = gltf.meshes || [];
  const skins = gltf.skins || [];
  const materials = gltf.materials || [];
  const textures = gltf.textures || [];
  const images = gltf.images || [];
  const animations = gltf.animations || [];
  const accessors = gltf.accessors || [];

  let totalTriangles = 0;
  let totalVertices = 0;
  let skinnedMeshCount = 0;
  const morphTargetNamesSet = new Set();
  let morphTargetCount = 0;

  // Bounding box computation from POSITION accessors
  let minX = Infinity, minY = Infinity, minZ = Infinity;
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;

  // Check skins / bones
  let totalBones = 0;
  for (const skin of skins) {
    if (skin.joints) {
      totalBones += skin.joints.length;
    }
  }

  // Check nodes for SkinnedMeshes
  for (const node of nodes) {
    if (node.skin !== undefined) {
      skinnedMeshCount++;
    }
  }

  // Iterate meshes
  for (let mIdx = 0; mIdx < meshes.length; mIdx++) {
    const mesh = meshes[mIdx];
    const targetNames = mesh.extras?.targetNames || [];

    if (Array.isArray(targetNames)) {
      for (const name of targetNames) {
        morphTargetNamesSet.add(name);
      }
    }

    if (mesh.primitives) {
      for (const prim of mesh.primitives) {
        // Triangle computation
        if (prim.indices !== undefined && accessors[prim.indices]) {
          const acc = accessors[prim.indices];
          totalTriangles += Math.floor(acc.count / 3);
        } else if (prim.attributes && prim.attributes.POSITION !== undefined) {
          const acc = accessors[prim.attributes.POSITION];
          if (acc) {
            totalTriangles += Math.floor(acc.count / 3);
          }
        }

        // Vertex count & bounding box from POSITION accessor
        if (prim.attributes && prim.attributes.POSITION !== undefined) {
          const posAcc = accessors[prim.attributes.POSITION];
          if (posAcc) {
            totalVertices += posAcc.count;
            if (Array.isArray(posAcc.min) && Array.isArray(posAcc.max)) {
              minX = Math.min(minX, posAcc.min[0]);
              minY = Math.min(minY, posAcc.min[1]);
              minZ = Math.min(minZ, posAcc.min[2]);
              maxX = Math.max(maxX, posAcc.max[0]);
              maxY = Math.max(maxY, posAcc.max[1]);
              maxZ = Math.max(maxZ, posAcc.max[2]);
            }
          }
        }

        // Morph targets
        if (prim.targets && Array.isArray(prim.targets)) {
          morphTargetCount = Math.max(morphTargetCount, prim.targets.length);
          for (let tIdx = 0; tIdx < prim.targets.length; tIdx++) {
            const fallbackName = targetNames[tIdx] || `target_${tIdx + 1}`;
            morphTargetNamesSet.add(fallbackName);
          }
        }
      }
    }
  }

  const morphTargetNames = Array.from(morphTargetNamesSet);
  const height = (maxY !== -Infinity && minY !== Infinity) ? (maxY - minY) : 0;
  const width = (maxX !== -Infinity && minX !== Infinity) ? (maxX - minX) : 0;
  const depth = (maxZ !== -Infinity && minZ !== Infinity) ? (maxZ - minZ) : 0;

  // Validation & Warnings
  if (totalTriangles > 80000) {
    warnings.push(`High polygon count (${totalTriangles.toLocaleString()} tris). Recommended < 60,000 for web mobile performance.`);
  }

  if (height > 0 && (height < 1.2 || height > 2.5)) {
    warnings.push(`Non-standard height detected (${height.toFixed(2)}m). Typical human avatar height is 1.6m - 1.95m. Auto-normalization in viewer recommended.`);
  }

  if (skins.length === 0 && skinnedMeshCount === 0) {
    warnings.push('No skeletal rig (Skin / Bones) detected. Model is static mesh.');
  }

  if (morphTargetNames.length === 0) {
    warnings.push('No morph targets (blendshapes) found. Parametric weight/body morphs will require procedural scaling or morph additions.');
  }

  // Determine suitability
  let resultVerdict = 'SUITABLE';
  if (totalTriangles > 150000 || height === 0) {
    resultVerdict = 'NEEDS OPTIMIZATION';
  }

  return {
    filename,
    isGlb,
    valid: true,
    meshCount: meshes.length,
    skinnedMeshCount,
    skeletonBones: totalBones,
    morphTargetCount: Math.max(morphTargetCount, morphTargetNames.length),
    morphTargetNames,
    height: height.toFixed(2),
    width: width.toFixed(2),
    depth: depth.toFixed(2),
    triangles: totalTriangles,
    vertices: totalVertices,
    materialsCount: materials.length,
    materialsList: materials.map(m => m.name || 'unnamed_material'),
    texturesCount: textures.length || images.length,
    animationClips: animations.map(a => a.name || 'unnamed_clip'),
    warnings,
    resultVerdict,
  };
}

function printReport(data) {
  const separator = '--------------------------------------------------';
  console.log('\nAvatar Inspection Report');
  console.log(separator);
  console.log(`File:              ${data.filename}`);
  console.log(`Format:            ${data.isGlb ? 'GLB (Binary glTF 2.0)' : 'glTF (JSON)'}`);
  console.log(`GLB/glTF Valid:    ${data.valid ? 'YES' : 'NO'}`);
  console.log(`Meshes:            ${data.meshCount}`);
  console.log(`SkinnedMesh:       ${data.skinnedMeshCount > 0 ? `YES (${data.skinnedMeshCount})` : 'NO'}`);
  console.log(`Skeleton Bones:    ${data.skeletonBones}`);
  console.log(`Morph Targets:     ${data.morphTargetCount}`);

  if (data.morphTargetNames.length > 0) {
    console.log('\nMorph Targets List:');
    data.morphTargetNames.forEach((name) => console.log(`  - ${name}`));
  }

  console.log(`\nDimensions (Bounding Box):`);
  console.log(`  Height (Y):      ${data.height} m`);
  console.log(`  Width (X):       ${data.width} m`);
  console.log(`  Depth (Z):       ${data.depth} m`);
  console.log(`Triangles:         ${data.triangles.toLocaleString()}`);
  console.log(`Vertices:          ${data.vertices.toLocaleString()}`);
  console.log(`Materials:         ${data.materialsCount} (${data.materialsList.slice(0, 3).join(', ')}${data.materialsList.length > 3 ? '...' : ''})`);
  console.log(`Textures:          ${data.texturesCount}`);
  console.log(`Animation Clips:   ${data.animationClips.length > 0 ? data.animationClips.join(', ') : 'None'}`);

  if (data.warnings.length > 0) {
    console.log('\nWarnings / Notes:');
    data.warnings.forEach((w) => console.log(`  [!] ${w}`));
  }

  console.log(separator);
  console.log(`RESULT:            ${data.resultVerdict}\n`);
}

// CLI Execution
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('Usage: node scripts/inspect-avatar.mjs <path-to-model.glb|gltf>');
  process.exit(1);
}

const targetPath = path.resolve(process.cwd(), args[0]);

if (!fs.existsSync(targetPath)) {
  console.error(`Error: File not found at "${targetPath}"`);
  process.exit(1);
}

try {
  const buffer = fs.readFileSync(targetPath);
  const ext = path.extname(targetPath).toLowerCase();
  let report;

  if (ext === '.glb') {
    report = inspectGlbBuffer(buffer, path.basename(targetPath));
  } else if (ext === '.gltf') {
    report = inspectGltfJson(buffer.toString('utf8'), path.basename(targetPath));
  } else {
    // Try auto-detecting
    if (buffer.length >= 4 && buffer.toString('utf8', 0, 4) === 'glTF') {
      report = inspectGlbBuffer(buffer, path.basename(targetPath));
    } else {
      report = inspectGltfJson(buffer.toString('utf8'), path.basename(targetPath));
    }
  }

  printReport(report);
} catch (err) {
  console.error(`Inspection Failed: ${err.message}`);
  process.exit(1);
}

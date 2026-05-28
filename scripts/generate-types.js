const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

try {
  console.log("Generando tipos de Supabase...");

  // Ejecutar sin encoding para obtener Buffer
  const buffer = execSync(
    "npx supabase gen types typescript --project-id zuqootrpmikaclglrckz --schema public",
    {
      encoding: "buffer",
      maxBuffer: 10 * 1024 * 1024, // 10MB buffer
      env: { ...process.env, LANG: "en_US.UTF-8" },
    },
  );

  // Convertir buffer a string UTF-8
  const output = buffer.toString("utf8");

  const outputPath = path.join(__dirname, "..", "types", "database.types.ts");
  fs.writeFileSync(outputPath, output, "utf8");

  console.log("✓ Tipos generados correctamente con codificación UTF-8");
} catch (error) {
  console.error("Error al generar tipos:", error.message);
  process.exit(1);
}

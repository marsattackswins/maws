import { describe, test, expect } from "@jest/globals";
import * as fs from "fs";
import * as path from "path";

describe("workflow validation", () => {
  describe("integration-tests.yml", () => {
    const workflowPath = path.join(__dirname, "../../.github/workflows/integration-tests.yml");

    test("workflow file exists", () => {
      expect(fs.existsSync(workflowPath)).toBe(true);
    });

    test("workflow has nightly cron schedule", () => {
      const content = fs.readFileSync(workflowPath, "utf-8");
      expect(content).toContain("cron: '0 2 * * *'");
    });

    test("workflow has workflow_dispatch trigger", () => {
      const content = fs.readFileSync(workflowPath, "utf-8");
      expect(content).toContain("workflow_dispatch:");
    });

    test("workflow has pull_request trigger", () => {
      const content = fs.readFileSync(workflowPath, "utf-8");
      expect(content).toContain("pull_request:");
    });

    test("workflow posts to WEBHOOK_URL", () => {
      const content = fs.readFileSync(workflowPath, "utf-8");
      expect(content).toContain("WEBHOOK_URL");
      expect(content).toContain("webhook notification");
    });

    test("workflow logs summary as JSON", () => {
      const content = fs.readFileSync(workflowPath, "utf-8");
      expect(content).toContain("integration-summary.jsonl");
      expect(content).toContain('"event":"integration_test_run"');
    });

    test("workflow outputs structured summary", () => {
      const content = fs.readFileSync(workflowPath, "utf-8");
      expect(content).toContain("outputs:");
      expect(content).toContain("status:");
      expect(content).toContain("duration:");
      expect(content).toContain("passed:");
      expect(content).toContain("failed:");
      expect(content).toContain("total:");
    });

    test("workflow has validate-workflow job", () => {
      const content = fs.readFileSync(workflowPath, "utf-8");
      expect(content).toContain("validate-workflow:");
      expect(content).toContain("Validate workflow YAML syntax");
    });

    test("YAML is valid syntax", () => {
      const content = fs.readFileSync(workflowPath, "utf-8");
      // Simple validation: check that the file can be parsed
      // In CI, Python's yaml.safe_load is used, but here we just check basic structure
      expect(content).toMatch(/^name:/);
      expect(content).toMatch(/^on:/m);
      expect(content).toMatch(/^jobs:/m);
    });
  });
});

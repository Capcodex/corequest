import { afterAll, describe, expect, it } from "vitest";

const sandboxUrl = process.env.SANDBOX_TEST_URL ?? "http://sandbox-service:4000/execute";

async function execute(code: string) {
  const response = await fetch(sandboxUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
  });

  return response.json();
}

describe("sandbox integration", () => {
  it("runs valid Rust code", async () => {
    const result = await execute('fn main() { println!("13"); }');
    expect(result.status).toBe("success");
    expect(result.stdout.trim()).toBe("13");
  });

  it("returns compile_error for invalid Rust code", async () => {
    const result = await execute('fn main( { println!("oops"); }');
    expect(result.status).toBe("compile_error");
  });

  it("returns timeout for infinite loops", async () => {
    const result = await execute("fn main() { loop {} }");
    expect(result.status).toBe("timeout");
  });

  it("captures stderr on panic", async () => {
    const result = await execute('fn main() { panic!("boom"); }');
    expect(result.status).toBe("runtime_error");
    expect(String(result.stderr)).toContain("boom");
  });

  it("blocks outbound networking attempts", async () => {
    const result = await execute(
      'use std::net::TcpStream; fn main() { TcpStream::connect("1.1.1.1:80").unwrap(); }',
    );
    expect(["runtime_error", "timeout"]).toContain(result.status);
  });
});

import { superoak } from  "../deps.js"
import { app } from "../app.js"
import { assert } from "../deps.js"

Deno.test({
    name: "GET / returns 200", 
    async fn() {
        const testClient = await superoak(app);
        await testClient.get("/").expect(200);
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "get to limited path when not logged in", 
    async fn() {
        const testClient = await superoak(app);
        let response = await testClient.get("/behaviour/reporting")
        .expect(200)
        assert(response.text.includes('Login'))
    },
    sanitizeResources: false,
    sanitizeOps: false
});
Deno.test({
    name: "registration", 
    async fn() {
        const testClient = await superoak(app);
        const response = await testClient.post("/auth/registration")
            .send("email=test@email.com&password=testpass")
            .expect(200) 
    assert(response.text.includes('The email is already reserved'))
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "login with wrong email", 
    async fn() {
        const testClient = await superoak(app);
        const response = await testClient.post("/auth/login")
            .send("email=fail@email.com&password=testpass")

        assert(response.text.includes('Invalid email or password'))
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "login with wrong password", 
    async fn() {
        const testClient = await superoak(app);
        const response = await testClient.post("/auth/login")
            .send("email=test@email.com&password=failpass")
        assert(response.text.includes('Invalid email or password'))
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "login", 
    async fn() {
        const testClient = await superoak(app);
        const response = await testClient.post("/auth/login")
            .send("email=test@email.com&password=testpass")
        assert(response.text.includes('Login successfull!'))
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "reporting page should work", 
    async fn() {
        let testClient = await superoak(app);
        let response = await testClient.post("/auth/login")
            .send("email=test@email.com&password=testpass")
        let headers = response.headers["set-cookie"];
        let cookie = headers.split(";")[0];

        testClient = await superoak(app);
        response = await testClient
            .get(`/behavior/reporting`)
            .set("Cookie", cookie)
            .expect(200);
        assert(response.text.includes('What would you like to report on?'))
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "summarization page should work", 
    async fn() {
        let testClient = await superoak(app);
    let response = await testClient.post("/auth/login")
        .send("email=test@email.com&password=testpass")
    let headers = response.headers["set-cookie"];
    let cookie = headers.split(";")[0];

    testClient = await superoak(app);
    response = await testClient
        .get(`/behavior/summary`)
        .set("Cookie", cookie)
        .expect(200);
    assert(response.text.includes('Weekly average (by default from last week)'))
    },
    sanitizeResources: false,
    sanitizeOps: false
});


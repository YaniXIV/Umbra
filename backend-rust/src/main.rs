mod routes;

use axum::Router;
use routes::{health::health_check, users::create_user};
use axum::routing::{get, post};
use std::net::SocketAddr;
use hyper::Server;

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/health", get(health_check))
        .route("/users", post(create_user));

    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    println!("🚀 Listening on http://{}", addr);

    Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}


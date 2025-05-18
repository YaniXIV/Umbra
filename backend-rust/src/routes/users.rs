use axum::{Json, http::StatusCode};
use serde::Deserialize;

#[derive(Deserialize)]
pub struct CreateUser {
    pub username: String,
    pub email: String,
}

pub async fn create_user(Json(payload): Json<CreateUser>) -> (StatusCode, String) {

    println!("Creating uesr: {:?}", payload.username);

    (StatusCode::CREATED, format!("User {} created", payload.username))
}

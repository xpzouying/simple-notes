#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{
    Manager, WindowEvent, Emitter,
    menu::{Menu, MenuItemBuilder, PredefinedMenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
};

mod lib;
use lib::*;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            // Create tray menu
            let menu = Menu::new(app)?;
            
            let open_item = MenuItemBuilder::with_id("open", "Open Notes").build(app)?;
            let settings_item = MenuItemBuilder::with_id("settings", "Settings").build(app)?;
            let project_item = MenuItemBuilder::with_id("project", "Project Page").build(app)?;
            let about_item = MenuItemBuilder::with_id("about", "About Author").build(app)?;
            let quit_item = MenuItemBuilder::with_id("quit", "Quit").build(app)?;
            
            menu.append(&open_item)?;
            menu.append(&PredefinedMenuItem::separator(app)?)?;
            menu.append(&settings_item)?;
            menu.append(&project_item)?;
            menu.append(&about_item)?;
            menu.append(&PredefinedMenuItem::separator(app)?)?;
            menu.append(&quit_item)?;

            // Create system tray
            let _tray = TrayIconBuilder::new()
                .menu(&menu)
                .on_menu_event(|app, event| match event.id.as_ref() {
                    "open" => {
                        let window = app.get_webview_window("main").unwrap();
                        toggle_window(&window);
                    }
                    "settings" => {
                        let window = app.get_webview_window("main").unwrap();
                        window.emit("open-settings", ()).unwrap();
                        toggle_window(&window);
                    }
                    "project" => {
                        let _ = webbrowser::open("https://github.com/xpzouying/simple-notes");
                    }
                    "about" => {
                        // Open author page
                        let _ = webbrowser::open("https://haha.ai");
                    }
                    "quit" => {
                        std::process::exit(0);
                    }
                    _ => {}
                })
                .on_tray_icon_event(|tray, event| match event {
                    TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } => {
                        let app = tray.app_handle();
                        let window = app.get_webview_window("main").unwrap();
                        toggle_window(&window);
                    }
                    _ => {}
                })
                .build(app)?;

            let window = app.get_webview_window("main").unwrap();
            
            // Position window near system tray
            position_window(&window);
            
            Ok(())
        })
        .on_window_event(|window, event| {
            if let WindowEvent::CloseRequested { api, .. } = event {
                window.hide().unwrap();
                api.prevent_close();
            }
        })
        .invoke_handler(tauri::generate_handler![])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
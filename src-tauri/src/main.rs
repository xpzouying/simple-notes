#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{
    Manager, WindowEvent, Emitter,
    menu::{Menu, MenuItemBuilder, PredefinedMenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconEvent},
};

use app_lib::*;

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

            // Get the tray icon that was created from config
            let tray = app.handle().tray_by_id("main-tray").unwrap();
            
            // Set menu and event handlers
            tray.set_menu(Some(menu))?;
            tray.on_menu_event(|app, event| match event.id.as_ref() {
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
            });
            
            tray.on_tray_icon_event(|tray, event| match event {
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
            });

            let window = app.get_webview_window("main").unwrap();
            
            // Position window near system tray
            position_window(&window);
            
            Ok(())
        })
        .on_window_event(|window, event| {
            match event {
                WindowEvent::CloseRequested { api, .. } => {
                    window.hide().unwrap();
                    api.prevent_close();
                }
                WindowEvent::Focused(false) => {
                    // 失去焦点时延迟隐藏窗口，防止误触
                    let window_clone = window.clone();
                    std::thread::spawn(move || {
                        std::thread::sleep(std::time::Duration::from_millis(200));
                        // 再次检查窗口是否仍然没有焦点
                        if !window_clone.is_focused().unwrap_or(false) {
                            window_clone.hide().unwrap();
                        }
                    });
                }
                _ => {}
            }
        })
        .invoke_handler(tauri::generate_handler![])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
use tauri::WebviewWindow;

#[cfg(target_os = "macos")]
use tauri_plugin_positioner::{WindowExt, Position};

#[cfg(target_os = "macos")]
use cocoa::appkit::{NSWindow, NSWindowCollectionBehavior};
#[cfg(target_os = "macos")]
use cocoa::base::id;

use tauri::Rect;

pub fn toggle_window(window: &WebviewWindow) {
    if window.is_visible().unwrap() {
        window.hide().unwrap();
    } else {
        window.show().unwrap();
        window.set_focus().unwrap();
        
        #[cfg(target_os = "macos")]
        {
            
            unsafe {
                let ns_window = window.ns_window().unwrap() as id;
                NSWindow::setLevel_(ns_window, 24); // Floating window level
                ns_window.setCollectionBehavior_(NSWindowCollectionBehavior::NSWindowCollectionBehaviorCanJoinAllSpaces);
            }
        }
    }
}

pub fn toggle_window_near_tray(window: &WebviewWindow) {
    if window.is_visible().unwrap() {
        window.hide().unwrap();
    } else {
        // Position window near tray icon with custom logic
        #[cfg(target_os = "macos")]
        {
            position_window_near_tray_custom(window);
        }
        
        #[cfg(not(target_os = "macos"))]
        {
            // Fallback to original positioning for non-macOS
            position_window(window);
        }
        
        window.show().unwrap();
        window.set_focus().unwrap();
        
        #[cfg(target_os = "macos")]
        {
            unsafe {
                let ns_window = window.ns_window().unwrap() as id;
                NSWindow::setLevel_(ns_window, 24); // Floating window level
                ns_window.setCollectionBehavior_(NSWindowCollectionBehavior::NSWindowCollectionBehaviorCanJoinAllSpaces);
            }
        }
    }
}

#[cfg(target_os = "macos")]
fn position_window_near_tray_custom(window: &WebviewWindow) {
    // First try to use positioner to get near the tray, then adjust
    let _ = window.as_ref().window().move_window(Position::TrayCenter);
    
    // Get current position after positioner moves it
    if let Ok(position) = window.outer_position() {
        if let Ok(size) = window.outer_size() {
            // Calculate adjustments for better UX:
            // 1. Add more vertical margin to create clear separation from menu bar
            // 2. Shift left more significantly so left edge is near icon position
            let margin_top = 16; // Increased gap below menu bar for clear separation
            let margin_left = -(size.width as i32 / 2) + 20; // Shift left so panel's left edge aligns near icon
            
            let new_x = position.x + margin_left;
            let new_y = position.y + margin_top;
            
            let _ = window.set_position(tauri::Position::Physical(tauri::PhysicalPosition {
                x: new_x,
                y: new_y,
            }));
        }
    }
}

pub fn position_window(window: &WebviewWindow) {
    // Get screen dimensions
    if let Some(monitor) = window.current_monitor().unwrap() {
        let screen_size = monitor.size();
        let scale_factor = monitor.scale_factor();
        
        // Window dimensions
        let window_width = 400.0;
        
        // Position in top-right corner with some margin
        let x = (screen_size.width as f64 / scale_factor) - window_width - 20.0;
        let y = 40.0; // Below menu bar
        
        window.set_position(tauri::Position::Physical(tauri::PhysicalPosition {
            x: (x * scale_factor) as i32,
            y: (y * scale_factor) as i32,
        })).unwrap();
    }
}

pub fn toggle_window_near_tray_rect(window: &WebviewWindow, tray_rect: Rect) {
    if window.is_visible().unwrap() {
        window.hide().unwrap();
    } else {
        // Position window near tray icon using absolute position from rect
        #[cfg(target_os = "macos")]
        {
            position_window_near_tray_rect(window, tray_rect);
        }
        
        #[cfg(not(target_os = "macos"))]
        {
            // Fallback to original positioning for non-macOS
            position_window(window);
        }
        
        window.show().unwrap();
        window.set_focus().unwrap();
        
        #[cfg(target_os = "macos")]
        {
            unsafe {
                let ns_window = window.ns_window().unwrap() as id;
                NSWindow::setLevel_(ns_window, 24); // Floating window level
                ns_window.setCollectionBehavior_(NSWindowCollectionBehavior::NSWindowCollectionBehaviorCanJoinAllSpaces);
            }
        }
    }
}

#[cfg(target_os = "macos")]
fn position_window_near_tray_rect(window: &WebviewWindow, tray_rect: Rect) {
    if let Ok(_size) = window.outer_size() {
        // Extract position from the enum
        let (tray_x, tray_y) = match tray_rect.position {
            tauri::Position::Physical(pos) => (pos.x, pos.y),
            tauri::Position::Logical(pos) => (pos.x as i32, pos.y as i32),
        };
        
        // Extract size from the enum
        let tray_height = match tray_rect.size {
            tauri::Size::Physical(size) => size.height as i32,
            tauri::Size::Logical(size) => size.height as i32,
        };
        
        // Calculate position based on tray icon's absolute position
        // Position the window so its left edge is near the tray icon with some offset
        let margin_top = 16; // Gap below menu bar
        let margin_left = 20; // Small horizontal offset from icon
        
        // Calculate new window position
        let new_x = tray_x + margin_left;
        let new_y = tray_y + tray_height + margin_top;
        
        let _ = window.set_position(tauri::Position::Physical(tauri::PhysicalPosition {
            x: new_x,
            y: new_y,
        }));
    }
}


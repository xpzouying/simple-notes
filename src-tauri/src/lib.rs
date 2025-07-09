use tauri::WebviewWindow;

#[cfg(target_os = "macos")]
use cocoa::appkit::{NSWindow, NSWindowCollectionBehavior};
#[cfg(target_os = "macos")]
use cocoa::base::id;

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


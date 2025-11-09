<?php
/**
 * Test Database Connection
 * 
 * This file tests if the database connection is working.
 * 
 * USAGE:
 * 1. Update db_connect.php with your credentials first
 * 2. Access this file in browser: https://yourdomain.com/admin/test_connection.php
 * 3. You should see a success message if connection works
 * 4. DELETE THIS FILE after testing for security!
 * 
 * SECURITY WARNING:
 * This file exposes database information. Delete it after testing!
 */

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

?>
<!DOCTYPE html>
<html>
<head>
    <title>Database Connection Test</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .success {
            background: #d4edda;
            border: 1px solid #c3e6cb;
            color: #155724;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .error {
            background: #f8d7da;
            border: 1px solid #f5c6cb;
            color: #721c24;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .info {
            background: #d1ecf1;
            border: 1px solid #bee5eb;
            color: #0c5460;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .warning {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        h1 {
            color: #333;
        }
        h2 {
            color: #666;
            margin-top: 30px;
        }
        code {
            background: #f4f4f4;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: monospace;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background: #333;
            color: white;
        }
    </style>
</head>
<body>
    <h1>🔍 Database Connection Test</h1>
    
    <?php
    // Include database connection
    require_once 'db_connect.php';
    
    // Check if connection is successful
    if (isset($conn) && $conn && !$conn->connect_error) {
        echo '<div class="success">';
        echo '<h2>✅ Database Connection Successful!</h2>';
        echo '<p>The database connection is working correctly.</p>';
        echo '</div>';
        
        // Get database info
        $dbResult = $conn->query("SELECT DATABASE() as db_name");
        $dbInfo = $dbResult->fetch_assoc();
        
        echo '<div class="info">';
        echo '<h3>📊 Connection Information</h3>';
        echo '<table>';
        echo '<tr><th>Property</th><th>Value</th></tr>';
        echo '<tr><td>Database Name</td><td><code>' . htmlspecialchars($dbInfo['db_name']) . '</code></td></tr>';
        echo '<tr><td>Server Info</td><td><code>' . htmlspecialchars($conn->server_info) . '</code></td></tr>';
        echo '<tr><td>Host Info</td><td><code>' . htmlspecialchars($conn->host_info) . '</code></td></tr>';
        echo '<tr><td>Protocol Version</td><td><code>' . $conn->protocol_version . '</code></td></tr>';
        echo '<tr><td>Client Info</td><td><code>' . htmlspecialchars($conn->client_info) . '</code></td></tr>';
        echo '</table>';
        echo '</div>';
        
        // Test if products table exists
        $tableCheck = $conn->query("SHOW TABLES LIKE 'products'");
        if ($tableCheck->num_rows > 0) {
            echo '<div class="success">';
            echo '<h3>✅ Products Table Exists</h3>';
            
            // Get table structure
            $structure = $conn->query("DESCRIBE products");
            echo '<table>';
            echo '<tr><th>Column</th><th>Type</th><th>Null</th><th>Key</th><th>Default</th></tr>';
            while ($row = $structure->fetch_assoc()) {
                echo '<tr>';
                echo '<td><code>' . htmlspecialchars($row['Field']) . '</code></td>';
                echo '<td><code>' . htmlspecialchars($row['Type']) . '</code></td>';
                echo '<td>' . htmlspecialchars($row['Null']) . '</td>';
                echo '<td>' . htmlspecialchars($row['Key']) . '</td>';
                echo '<td>' . htmlspecialchars($row['Default'] ?? 'NULL') . '</td>';
                echo '</tr>';
            }
            echo '</table>';
            
            // Count products
            $countResult = $conn->query("SELECT COUNT(*) as count FROM products");
            $count = $countResult->fetch_assoc()['count'];
            echo '<p><strong>Total Products in Database:</strong> <code>' . $count . '</code></p>';
            
            // Show sample products if any exist
            if ($count > 0) {
                $sampleResult = $conn->query("SELECT id, type, category, price FROM products ORDER BY id DESC LIMIT 5");
                echo '<h4>Sample Products (Latest 5):</h4>';
                echo '<table>';
                echo '<tr><th>ID</th><th>Type</th><th>Category</th><th>Price</th></tr>';
                while ($row = $sampleResult->fetch_assoc()) {
                    echo '<tr>';
                    echo '<td>' . htmlspecialchars($row['id']) . '</td>';
                    echo '<td>' . htmlspecialchars($row['type']) . '</td>';
                    echo '<td>' . htmlspecialchars($row['category']) . '</td>';
                    echo '<td>R' . number_format($row['price'], 2) . '</td>';
                    echo '</tr>';
                }
                echo '</table>';
            }
            
            echo '</div>';
        } else {
            echo '<div class="warning">';
            echo '<h3>⚠️ Products Table Not Found</h3>';
            echo '<p>The <code>products</code> table does not exist in the database.</p>';
            echo '<p><strong>Solution:</strong> Run the <code>schema.sql</code> file in phpMyAdmin to create the table.</p>';
            echo '<ol>';
            echo '<li>Go to phpMyAdmin in cPanel</li>';
            echo '<li>Select your database</li>';
            echo '<li>Click on "SQL" tab</li>';
            echo '<li>Copy and paste the contents of <code>schema.sql</code></li>';
            echo '<li>Click "Go" to execute</li>';
            echo '</ol>';
            echo '</div>';
        }
        
        // Test a simple query
        try {
            $testQuery = $conn->query("SELECT 1 as test");
            if ($testQuery) {
                echo '<div class="success">';
                echo '<p>✅ Test query executed successfully!</p>';
                echo '</div>';
            }
        } catch (Exception $e) {
            echo '<div class="error">';
            echo '<p>❌ Test query failed: ' . htmlspecialchars($e->getMessage()) . '</p>';
            echo '</div>';
        }
        
        $conn->close();
        
    } else {
        echo '<div class="error">';
        echo '<h2>❌ Database Connection Failed!</h2>';
        
        if (isset($conn)) {
            echo '<p><strong>Error:</strong> <code>' . htmlspecialchars($conn->connect_error) . '</code></p>';
        } else {
            echo '<p><strong>Error:</strong> Connection object not created.</p>';
        }
        
        echo '<h3>🔧 Troubleshooting Steps:</h3>';
        echo '<ol>';
        echo '<li>Check if database credentials in <code>db_connect.php</code> are correct</li>';
        echo '<li>Verify database name includes Hostking prefix (e.g., <code>youruser_ama_nice_db</code>)</li>';
        echo '<li>Verify username includes Hostking prefix (e.g., <code>youruser_admin</code>)</li>';
        echo '<li>Check if password is correct (no extra spaces)</li>';
        echo '<li>Verify database user has been added to the database in cPanel</li>';
        echo '<li>Check if user has ALL PRIVILEGES on the database</li>';
        echo '<li>Verify hostname is <code>localhost</code> (usually correct for Hostking)</li>';
        echo '</ol>';
        echo '</div>';
    }
    ?>
    
    <div class="warning">
        <h3>⚠️ Security Warning</h3>
        <p><strong>DELETE THIS FILE after testing!</strong> This file exposes database information and should not be accessible to the public.</p>
        <p>To delete: Go to File Manager in cPanel → Navigate to /admin/ folder → Delete test_connection.php</p>
    </div>
    
    <div class="info">
        <h3>📝 Next Steps</h3>
        <ol>
            <li>If connection is successful, test the API endpoints:
                <ul>
                    <li><code>https://yourdomain.com/admin/getProducts.php</code></li>
                    <li>Test saving a product via admin dashboard</li>
                </ul>
            </li>
            <li>If products table doesn't exist, run <code>schema.sql</code> in phpMyAdmin</li>
            <li>Delete this test file after verifying everything works</li>
        </ol>
    </div>
</body>
</html>


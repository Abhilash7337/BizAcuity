// Debug script to test admin API access
const adminEmail = 'admin@gmail.com';
const adminPassword = 'admin123';

async function testAdminAccess() {
    try {
        console.log('🔐 Testing admin login...');
        
        // Step 1: Login as admin
        const loginResponse = await fetch('http://localhost:5001/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                email: adminEmail,
                password: adminPassword
            }),
        });
        
        if (!loginResponse.ok) {
            throw new Error(`Login failed: ${loginResponse.status}`);
        }
        
        const loginData = await loginResponse.json();
        console.log('✅ Login successful');
        console.log('User data:', {
            name: loginData.user.name,
            email: loginData.user.email,
            userType: loginData.user.userType
        });
        
        const token = loginData.token;
        console.log('Token exists:', !!token);
        
        // Step 2: Test admin drafts access
        console.log('\n📋 Testing admin drafts access...');
        
        const draftsResponse = await fetch('http://localhost:5001/admin/drafts', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Drafts response status:', draftsResponse.status);
        
        if (!draftsResponse.ok) {
            const errorText = await draftsResponse.text();
            console.error('❌ Drafts fetch failed:', errorText);
            return;
        }
        
        const draftsData = await draftsResponse.json();
        console.log('✅ Drafts fetch successful');
        console.log('Total drafts:', draftsData.pagination.totalDrafts);
        console.log('Drafts returned:', draftsData.drafts.length);
        
        if (draftsData.drafts.length > 0) {
            console.log('First draft:', {
                name: draftsData.drafts[0].name,
                creator: draftsData.drafts[0].userId.name
            });
        }
        
    } catch (error) {
        console.error('❌ Error during test:', error.message);
    }
}

testAdminAccess();

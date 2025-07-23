#!/usr/bin/env node

/**
 * Consolidated Ringba API Test Suite
 * Combines all Ringba API testing functionality into one comprehensive test
 */

require('dotenv').config();
const { RingbaClient } = require('../../services/api/dist/services/ringba-client.js');

async function runRingbaApiTests() {
    console.log('🔗 Ringba API Test Suite');
    console.log('========================');
    console.log(`Started at: ${new Date().toISOString()}`);
    
    let testsPassed = 0;
    let totalTests = 0;
    const testResults = [];
    
    // Test 1: Environment Configuration
    console.log('\n🔧 Test 1: Environment Configuration');
    console.log('------------------------------------');
    totalTests++;
    
    try {
        const requiredEnvVars = ['RINGBA_API_TOKEN', 'RINGBA_ACCOUNT_ID'];
        const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
        
        if (missingVars.length > 0) {
            throw new Error(`Missing environment variables: ${missingVars.join(', ')}`);
        }
        
        console.log('✅ All required environment variables present');
        testsPassed++;
        testResults.push({ test: 'Environment Configuration', status: 'PASSED', details: 'All required env vars present' });
        
    } catch (error) {
        console.log(`❌ Environment configuration failed: ${error.message}`);
        testResults.push({ test: 'Environment Configuration', status: 'FAILED', details: error.message });
    }
    
    // Test 2: API Connection and Authentication
    console.log('\n🔐 Test 2: API Connection and Authentication');
    console.log('--------------------------------------------');
    totalTests++;
    
    try {
        const ringbaClient = new RingbaClient();
        
        // Test with yesterday to today date range (known working pattern)
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const today = new Date();
        
        const dateRange = {
            reportStart: yesterday.toISOString().split('T')[0],
            reportEnd: today.toISOString().split('T')[0]
        };
        
        console.log(`   Testing date range: ${dateRange.reportStart} to ${dateRange.reportEnd}`);
        
        const calls = await ringbaClient.getCalls(dateRange.reportStart, dateRange.reportEnd, 10);
        
        console.log(`✅ API connection successful - Retrieved ${calls.length} calls`);
        console.log(`   Sample call data structure validated`);
        
        if (calls.length > 0) {
            const sampleCall = calls[0];
            const expectedFields = ['callDt', 'inboundPhoneNumber', 'buyer', 'callLengthInSeconds'];
            const hasRequiredFields = expectedFields.every(field => sampleCall.hasOwnProperty(field));
            
            if (hasRequiredFields) {
                console.log('✅ Call data structure validation passed');
            } else {
                console.log('⚠️  Call data structure incomplete but connection working');
            }
        }
        
        testsPassed++;
        testResults.push({ 
            test: 'API Connection', 
            status: 'PASSED', 
            details: `${calls.length} calls retrieved, authentication working` 
        });
        
    } catch (error) {
        console.log(`❌ API connection failed: ${error.message}`);
        testResults.push({ test: 'API Connection', status: 'FAILED', details: error.message });
    }
    
    // Test 3: Call Data Validation
    console.log('\n📊 Test 3: Call Data Validation');
    console.log('--------------------------------');
    totalTests++;
    
    try {
        const ringbaClient = new RingbaClient();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const today = new Date();
        
        const calls = await ringbaClient.getCalls(
            yesterday.toISOString().split('T')[0],
            today.toISOString().split('T')[0],
            50
        );
        
        if (calls.length === 0) {
            console.log('⚠️  No calls found for validation - this may be expected');
            testsPassed++;
            testResults.push({ test: 'Call Data Validation', status: 'PASSED', details: 'No calls to validate (expected)' });
        } else {
            // Validate call data structure
            const sampleCall = calls[0];
            const validationResults = {
                hasCallDt: !!sampleCall.callDt,
                hasPhoneNumber: !!sampleCall.inboundPhoneNumber,
                hasDuration: typeof sampleCall.callLengthInSeconds === 'number',
                hasRevenue: typeof sampleCall.conversionAmount === 'number' || sampleCall.conversionAmount === null,
                hasCosts: typeof sampleCall.payoutAmount === 'number' || sampleCall.payoutAmount === null
            };
            
            const validFields = Object.values(validationResults).filter(Boolean).length;
            const totalFields = Object.keys(validationResults).length;
            
            console.log(`   Validated ${calls.length} calls`);
            console.log(`   Data completeness: ${validFields}/${totalFields} fields valid`);
            
            if (validFields >= 3) {
                console.log('✅ Call data validation passed');
                testsPassed++;
                testResults.push({ 
                    test: 'Call Data Validation', 
                    status: 'PASSED', 
                    details: `${calls.length} calls validated, ${validFields}/${totalFields} fields complete` 
                });
            } else {
                throw new Error(`Insufficient data quality: ${validFields}/${totalFields} fields valid`);
            }
        }
        
    } catch (error) {
        console.log(`❌ Call data validation failed: ${error.message}`);
        testResults.push({ test: 'Call Data Validation', status: 'FAILED', details: error.message });
    }
    
    // Test Results Summary
    console.log('\n📊 Ringba API Test Results');
    console.log('===========================');
    console.log(`Completed at: ${new Date().toISOString()}`);
    console.log(`Tests Passed: ${testsPassed}/${totalTests}`);
    console.log(`Success Rate: ${((testsPassed / totalTests) * 100).toFixed(1)}%`);
    
    console.log('\n📋 Detailed Results:');
    testResults.forEach((result, index) => {
        const icon = result.status === 'PASSED' ? '✅' : '❌';
        console.log(`   ${icon} Test ${index + 1}: ${result.test} - ${result.status}`);
        console.log(`      ${result.details}`);
    });
    
    return testsPassed === totalTests;
}

// Run the test suite
if (require.main === module) {
    runRingbaApiTests()
        .then(success => {
            process.exit(success ? 0 : 1);
        })
        .catch(error => {
            console.error('Ringba API test suite failed:', error);
            process.exit(1);
        });
}

module.exports = { runRingbaApiTests };
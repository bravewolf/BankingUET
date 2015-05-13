package com.mypackage;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import com.worklight.server.auth.api.MissingConfigurationOptionException;
import com.worklight.server.auth.api.UserIdentity;
import com.worklight.server.auth.api.WorkLightAuthLoginModule;

public class  CustomerLoginModule implements WorkLightAuthLoginModule {

	/**
	 * 
	 */
	private static final long serialVersionUID = 4094493300577236864L;
	private String USERNAME;
	private String PASSWORD;
	
	public void init(Map<String, String> options) throws MissingConfigurationOptionException {
	}

	public boolean login(Map<String, Object> authenticationData) {
		USERNAME = (String) authenticationData.get("username");
		PASSWORD = (String) authenticationData.get("password");

		if (USERNAME.equals("customer") && PASSWORD.equals("12345")) 
			return true;
		else 
			throw new RuntimeException("Invalid credentials");
	}

	
	public UserIdentity createIdentity(String loginModule) {
		HashMap<String, Object> customAttributes = new HashMap<String, Object>();
		customAttributes.put("AuthenticationDate", new Date());
		
		UserIdentity identity = new UserIdentity(loginModule, USERNAME, null, null, customAttributes, PASSWORD);
		return identity;
	}
	


	public void logout() {
		USERNAME = null;
		PASSWORD = null;
	}

	public void abort() {
		USERNAME = null;
		PASSWORD = null;
	}

	@Override
    public CustomerLoginModule clone() throws CloneNotSupportedException {
        return (CustomerLoginModule) super.clone();
    }

}

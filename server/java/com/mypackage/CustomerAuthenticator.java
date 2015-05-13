package com.mypackage;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.worklight.server.auth.api.AuthenticationResult;
import com.worklight.server.auth.api.AuthenticationStatus;
import com.worklight.server.auth.api.MissingConfigurationOptionException;
import com.worklight.server.auth.api.UserIdentity;
import com.worklight.server.auth.api.WorkLightAuthenticator;


public class CustomerAuthenticator implements WorkLightAuthenticator{
	private static final long serialVersionUID = -383679434474844375L;
	
	private static final Logger logger = Logger.getLogger(CustomerAuthenticator.class.getName());

	private String username;
	private String password;
	
	public void init(Map<String, String> options) throws MissingConfigurationOptionException {
		logger.info("CustomerAuthenticator initialized");
	}

	public AuthenticationResult processRequest(HttpServletRequest request, HttpServletResponse response, boolean isAccessToProtectedResource) throws IOException,	ServletException {
		if (request.getRequestURI().contains("customer_auth_request_url")){
			this.username = request.getParameter("username");
			this.password = request.getParameter("password");
			
			if (null != username && null != password && username.length() > 0 && password.length() > 0) {
				return AuthenticationResult.createFrom(AuthenticationStatus.SUCCESS);
			} else {
				response.setContentType("application/json; charset=UTF-8");
				response.setHeader("Cache-Control", "no-cache, must-revalidate");
				response.getWriter().print("{\"authStatus\":\"requiredcustomer\", \"errorMessage\":\"Please enter username and password\"}");
				return AuthenticationResult.createFrom(AuthenticationStatus.CLIENT_INTERACTION_REQUIRED);
			}
		} 
		
		if (!isAccessToProtectedResource) 
			return AuthenticationResult.createFrom(AuthenticationStatus.REQUEST_NOT_RECOGNIZED);
		
		response.setContentType("application/json; charset=UTF-8");
		response.setHeader("Cache-Control", "no-cache, must-revalidate");
		response.getWriter().print("{\"authStatus\":\"requiredcustomer\"}");
		return AuthenticationResult.createFrom(AuthenticationStatus.CLIENT_INTERACTION_REQUIRED);
	}

	public boolean changeResponseOnSuccess(HttpServletRequest request, HttpServletResponse response) throws IOException {
		if (request.getRequestURI().contains("customer_auth_request_url")){
			response.setContentType("application/json; charset=UTF-8");
			response.setHeader("Cache-Control", "no-cache, must-revalidate");
			response.getWriter().print("{\"authStatus\":\"customercomplete\"}");
			return true;
		}
		return false;
	}

	public AuthenticationResult processAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, 
			String errorMessage) throws IOException, ServletException {
			response.setContentType("application/json; charset=UTF-8");
			response.setHeader("Cache-Control", "no-cache, must-revalidate");
			response.getWriter().print(
					"{\"authStatus\":\"requiredcustomer\", \"errorMessage\":\""
							+ errorMessage + "\"}");
			return AuthenticationResult
					.createFrom(AuthenticationStatus.CLIENT_INTERACTION_REQUIRED);
	}


	public AuthenticationResult processRequestAlreadyAuthenticated(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
		return AuthenticationResult.createFrom(AuthenticationStatus.REQUEST_NOT_RECOGNIZED);
	}

	
	public Map<String, Object> getAuthenticationData() {
		logger.info("getAuthenticationData");
		Map<String, Object> authenticationData = new HashMap<String, Object>();
		authenticationData.put("username", username);
		authenticationData.put("password", password);
		return authenticationData;
	}
	
	public HttpServletRequest getRequestToProceed(HttpServletRequest request, HttpServletResponse response, UserIdentity userIdentity)	throws IOException {
		return null;
	}

	@Override
    public WorkLightAuthenticator clone() throws CloneNotSupportedException {
		CustomerAuthenticator otherAuthenticator = (CustomerAuthenticator) super.clone();		
        return otherAuthenticator;
    }

}

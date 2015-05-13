/*
 *
    COPYRIGHT LICENSE: This information contains sample code provided in source code form. You may copy, modify, and distribute
    these sample programs in any form without payment to IBMÂ® for the purposes of developing, using, marketing or distributing
    application programs conforming to the application programming interface for the operating platform for which the sample code is written.
    Notwithstanding anything to the contrary, IBM PROVIDES THE SAMPLE SOURCE CODE ON AN "AS IS" BASIS AND IBM DISCLAIMS ALL WARRANTIES,
    EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, ANY IMPLIED WARRANTIES OR CONDITIONS OF MERCHANTABILITY, SATISFACTORY QUALITY,
    FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND ANY WARRANTY OR CONDITION OF NON-INFRINGEMENT. IBM SHALL NOT BE LIABLE FOR ANY DIRECT,
    INDIRECT, INCIDENTAL, SPECIAL OR CONSEQUENTIAL DAMAGES ARISING OUT OF THE USE OR OPERATION OF THE SAMPLE SOURCE CODE.
    IBM HAS NO OBLIGATION TO PROVIDE MAINTENANCE, SUPPORT, UPDATES, ENHANCEMENTS OR MODIFICATIONS TO THE SAMPLE SOURCE CODE.

 */

package com.sample;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.SQLIntegrityConstraintViolationException;
import java.util.logging.Logger;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;
import javax.ws.rs.DELETE;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import com.ibm.json.java.JSONArray;
import com.ibm.json.java.JSONObject;
import com.worklight.adapters.rest.api.WLServerAPI;
import com.worklight.adapters.rest.api.WLServerAPIProvider;
import com.worklight.core.auth.OAuthSecurity;


@Path("/")
public class UserAdapterResource {
	/*
	 * For more info on JAX-RS see https://jsr311.java.net/nonav/releases/1.1/index.html
	 */
	
    //Define the server api to be able to perform server operations
    WLServerAPI api = WLServerAPIProvider.getWLServerAPI();
    
    static DataSource ds = null;
    static Context ctx = null;

    
    public static void init() throws NamingException {
    	ctx = new InitialContext();
    	
    	//The JDBC configuration is inside the server.xml
    	//Liberty will handle connection pooling for us.
        ds = (DataSource)ctx.lookup("jdbc/mobilefirst_training");
    }

	@POST
	@OAuthSecurity(scope="ManagerAuthenticatorRealm")
	public Response createCustomer(@FormParam("customerId") String customerId, 
								@FormParam("firstName") String firstName, 
								@FormParam("lastName") String lastName, 
								@FormParam("password") String password) 
										throws SQLException{
		
		Connection con = ds.getConnection();
		PreparedStatement insertCustomer = con.prepareStatement("INSERT INTO customers (customerId, firstName, lastName, password) VALUES (?,?,?,?)");
		
		try{
			insertCustomer.setString(1, customerId);
			insertCustomer.setString(2, firstName);
			insertCustomer.setString(3, lastName);
			insertCustomer.setString(4, password);
			insertCustomer.executeUpdate();
			//Return a 200 OK
			return Response.ok().build();
		}
		catch (SQLIntegrityConstraintViolationException violation) {
			//Trying to create a customer that already exists
			return Response.status(Status.CONFLICT).entity(violation.getMessage()).build();
		}
		finally{
			//Close resources in all cases
			insertCustomer.close();
			con.close();
		}

		
	}
	
	@GET
	@Produces("application/json")
	@Path("/{customerId}")
	public Response getCustomer(@PathParam("customerId") String customerId) throws SQLException{
		Connection con = ds.getConnection();
		PreparedStatement getCustomer = con.prepareStatement("SELECT * FROM customers WHERE customerId = ?");

		try{
			JSONObject result = new JSONObject();

			getCustomer.setString(1, customerId);
			ResultSet data = getCustomer.executeQuery();
			
			if(data.first()){
				result.put("customerId", data.getString("customerId"));
				result.put("firstName", data.getString("firstName"));
				result.put("lastName", data.getString("lastName"));
				result.put("password", data.getString("password"));
				return Response.ok(result).build();

			} else{
				return Response.status(Status.NOT_FOUND).entity("Customer not found...").build();
			}
		
		}
		finally{
			//Close resources in all cases
			getCustomer.close();
			con.close();
		}
		
	}
	
	@GET
	@Produces("application/json")
	public Response getAllCustomers() throws SQLException{
		JSONArray results = new JSONArray();
		Connection con = ds.getConnection();
		PreparedStatement getAllCustomers = con.prepareStatement("SELECT * FROM customers");
		ResultSet data = getAllCustomers.executeQuery();
		
		while(data.next()){
			JSONObject item = new JSONObject();
			item.put("customerId", data.getString("customerId"));
			item.put("firstName", data.getString("firstName"));
			item.put("lastName", data.getString("lastName"));
			item.put("password", data.getString("password"));
			
			results.add(item);
		}
		
		getAllCustomers.close();
		con.close();
		
		return Response.ok(results).build();
	}
	
	@PUT
	@Path("/{customerId}")
	@OAuthSecurity(scope="ManagerAuthenticatorRealm")
	public Response updateCustomer(@PathParam("customerId") String customerId, 
								@FormParam("firstName") String firstName, 
								@FormParam("lastName") String lastName, 
								@FormParam("password") String password) 
										throws SQLException{
		Connection con = ds.getConnection();
		PreparedStatement getCustomer = con.prepareStatement("SELECT * FROM customers WHERE customerId = ?");
		
		try{
			getCustomer.setString(1, customerId);
			ResultSet data = getCustomer.executeQuery();
			
			if(data.first()){
				PreparedStatement updateCustomer = con.prepareStatement("UPDATE customers SET firstName = ?, lastName = ?, password = ? WHERE customerId = ?");
				
				updateCustomer.setString(1, firstName);
				updateCustomer.setString(2, lastName);
				updateCustomer.setString(3, password);
				updateCustomer.setString(4, customerId);
				
				updateCustomer.executeUpdate();
				updateCustomer.close();
				return Response.ok().build();

							
			} else{
				return Response.status(Status.NOT_FOUND).entity("Customer not found...").build();
			}
		}
		finally{
			//Close resources in all cases
			getCustomer.close();
			con.close();
		}
		
	}
	
	@DELETE
	@Path("/{customerId}")
	@OAuthSecurity(scope="ManagerAuthenticatorRealm")
	public Response deleteCustomer(@PathParam("customerId") String customerId) throws SQLException{
		Connection con = ds.getConnection();
		PreparedStatement getCustomer = con.prepareStatement("SELECT * FROM customers WHERE customerId = ?");
		
		try{
			getCustomer.setString(1, customerId);
			ResultSet data = getCustomer.executeQuery();
			
			if(data.first()){
				PreparedStatement deleteCustomer = con.prepareStatement("DELETE FROM customers WHERE customerId = ?");
				deleteCustomer.setString(1, customerId);
				deleteCustomer.executeUpdate();
				deleteCustomer.close();
				return Response.ok().build();
							
			} else{
				return Response.status(Status.NOT_FOUND).entity("Customer not found...").build();
			}
		}
		finally{
			//Close resources in all cases
			getCustomer.close();
			con.close();
		}
		
	}
	
}